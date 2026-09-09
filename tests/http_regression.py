import os,tempfile,subprocess,time,urllib.request,urllib.error,urllib.parse,http.cookiejar,json,pathlib,shutil,sqlite3,re,socket
SOURCE=pathlib.Path(__file__).resolve().parents[1]
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args):return None
with tempfile.TemporaryDirectory() as temp:
    root=pathlib.Path(temp)/'app';shutil.copytree(SOURCE,root,ignore=shutil.ignore_patterns('.git','vendor','storage','.env'))
    db=sqlite3.connect(pathlib.Path(temp)/'test.db')
    db.executescript('CREATE TABLE users(id INTEGER PRIMARY KEY,name TEXT,email TEXT,password TEXT,created_at INT,updated_at INT); INSERT INTO users VALUES(1,"Test","test@example.invalid","",0,0); CREATE TABLE goals(id INTEGER PRIMARY KEY,user_id INT,title TEXT,target_value REAL,current_value REAL,unit TEXT,created_at INT,updated_at INT);');db.commit()
    password='temporary-test-password';hashed=subprocess.check_output(['php','-r','echo password_hash($argv[1], PASSWORD_DEFAULT);',password],text=True)
    (root/'.env').write_text(f'APP_ENV=testing\nDB_HOST=\nDB_NAME={temp}/test.db\nADMIN_PASSWORD_HASH={hashed}\nSESSION_LIFETIME=3600\n')
    with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
    origin=f'http://127.0.0.1:{port}';jar=http.cookiejar.CookieJar();client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar),NoRedirect())
    server=subprocess.Popen(['php','-S',f'127.0.0.1:{port}','index.php'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    def request(path,body=None):
        data=urllib.parse.urlencode(body).encode() if body is not None else None
        try:r=client.open(urllib.request.Request(origin+path,data=data),timeout=5)
        except urllib.error.HTTPError as error:r=error
        return r.status,r.headers,r.read().decode()
    def csrf(html):return re.search(r'name="csrf_token" value="([a-f0-9]+)"',html)[1]
    try:
        for _ in range(50):
            try:_,_,html=request('/login');break
            except OSError:time.sleep(.1)
        before=[c.value for c in jar]
        assert request('/action/auth/login',{'password':password,'csrf_token':csrf(html)})[0]==302
        assert [c.value for c in jar]!=before
        status,_,html=request('/goals');assert status==200
        token=csrf(html)
        form={'title':'Train 12 times','unit':'workouts','target_value':'12','current_value':'2','csrf_token':token}
        assert request('/action/goals/save',form)[0]==302
        row=db.execute('SELECT id,current_value FROM goals').fetchone();assert row[1]==2
        assert request('/action/goals/save',{**form,'id':row[0],'current_value':'4'})[0]==302
        assert db.execute('SELECT current_value FROM goals').fetchone()[0]==4
        assert request('/action/goals/save',{**form,'id':row[0],'csrf_token':'bad'})[0]==403
        assert request('/action/goals/save',{**form,'id':999})[0]==404
        assert request('/action/goals/save',{**form,'target_value':'-2'})[0]==302
        assert db.execute('SELECT COUNT(*) FROM goals').fetchone()[0]==1
        assert request('/action/goals/delete',{'id':row[0],'csrf_token':token})[0]==302
        assert db.execute('SELECT COUNT(*) FROM goals').fetchone()[0]==0
        request('/action/auth/logout',{'csrf_token':token})
        for _ in range(10):
            jar.clear();_,_,html=request('/login')
            status,_,_=request('/action/auth/login',{'password':'wrong','csrf_token':csrf(html)})
        assert status==429
        print('Workout: goal CRUD, validation, CSRF, session rotation and cross-session throttling passed.')
    finally:server.terminate();server.wait();db.close()
