#!/usr/bin/env bash

# --- STATE MANAGEMENT ---
STATE_FILE="$HOME/.gatekeeper_state"
TODAY=$(date +%Y-%m-%d)
HOUR=$(date +%H)

# Colors & Formatting
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
PURPLE='\033[1;35m'
CYAN='\033[1;36m'
NC='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

# Database Helpers
get_val() {
    grep "^${TODAY}_$1=" "$STATE_FILE" 2>/dev/null | tail -n 1 | cut -d'=' -f2
}

set_val() {
    echo "${TODAY}_$1=$2" >> "$STATE_FILE"
}

# Ensure file exists
touch "$STATE_FILE"

# --- INPUT VALIDATION HELPERS ---

# Usage: ask_bool "Prompt text"
# Returns: 0 for yes, 1 for no/skip (and prints nothing)
# Sets variable $ANSWER to "y" if yes
ask_bool() {
    while true; do
        read -p "$1 (y/n / enter=skip): " raw_input
        # Trim input
        raw_input=$(echo "$raw_input" | xargs)
        
        if [ -z "$raw_input" ]; then 
            return 1 # treat skip as no
        fi

        case "$raw_input" in
            [Yy]|[Yy][Ee][Ss]) ANSWER="y"; return 0 ;;
            [Nn]|[Nn][Oo]) return 1 ;;
            *) echo -e "${RED}Please enter 'y' or 'n'.${NC}" ;;
        esac
    done
}

# Usage: ask_int "Prompt text"
# Sets variable $INT_VAL. Loops until a number or empty is entered.
# Returns 0 if number, 1 if skipped/empty.
ask_int() {
    while true; do
        read -p "$1" raw_input
        # Trim input
        raw_input=$(echo "$raw_input" | xargs)

        if [ -z "$raw_input" ]; then
            return 1
        fi

        if [[ "$raw_input" =~ ^[0-9]+$ ]]; then
            INT_VAL="$raw_input"
            return 0
        else
            echo -e "${RED}Invalid number. Please try again.${NC}"
        fi
    done
}


echo -e "${BOLD}:: PROTOCOL V4 (Strict Mode) ::${NC}"

# ---------------------------------------------------------
# 1. MORNING SQUATS (4 AM - 10 AM)
# ---------------------------------------------------------
if [ "$HOUR" -ge 4 ] && [ "$HOUR" -lt 10 ]; then
    done_sq=$(get_val "M_SQUATS")
    if [ "$done_sq" != "1" ]; then
        echo -e "${RED}[!] WAKE UP.${NC} 15 Body Weight Squats."
        if ask_bool "Done?"; then
            set_val "M_SQUATS" "1"
            echo -e "${GREEN}-> Good morning.${NC}"
        fi
    fi
fi

# ---------------------------------------------------------
# 2. THE BIKE
# ---------------------------------------------------------
bike_goal=60
current_bike=$(get_val "BIKE_MINS")
if [ -z "$current_bike" ]; then current_bike=0; fi

if [ "$bike_goal" -gt 0 ]; then percent=$((current_bike * 100 / bike_goal)); else percent=100; fi
bar_len=$((percent / 5))
bar_str=""
for ((i=0; i<bar_len; i++)); do bar_str="${bar_str}#"; done
for ((i=bar_len; i<20; i++)); do bar_str="${bar_str}."; done

if [ "$current_bike" -lt "$bike_goal" ]; then
    echo -e "${BLUE}[BIKE]${NC} [${bar_str}] ${current_bike}/${bike_goal} min"
    
    if ask_int "Add minutes? (number / enter=skip): "; then
        input_mins=$INT_VAL
        new_total=$((current_bike + input_mins))
        set_val "BIKE_MINS" "$new_total"
        if [ "$new_total" -ge "$bike_goal" ]; then 
            echo -e "${GREEN}-> GOAL MET.${NC}"
        else 
            echo -e "${BLUE}-> Logged.${NC}"
        fi
    fi
else
    echo -e "${GREEN}[✔] BIKE COMPLETE ($current_bike min)${NC}"
fi

# ---------------------------------------------------------
# 3. THE DUMBBELL LOGBOOK (Granular)
# ---------------------------------------------------------
echo -e "${PURPLE}[ARMS]${NC} Target: 3 Movements x 2 Sets"

lifts_complete=0

for i in 1 2 3; do
    # Check if this specific movement index is logged
    lift_name=$(get_val "LIFT_${i}_NAME")
    lift_s1=$(get_val "LIFT_${i}_S1")
    lift_s2=$(get_val "LIFT_${i}_S2")

    if [ -n "$lift_name" ]; then
        # Already done
        echo -e "  ${GREEN}[✔] #${i}: $lift_name${NC} ${DIM}(${lift_s1}, ${lift_s2} reps)${NC}"
        lifts_complete=$((lifts_complete + 1))
    else
        # Not done - Ask user
        echo -e "  ${YELLOW}[?] Movement #${i} empty.${NC}"
        read -p "      Enter Exercise Name (or Enter to skip): " input_name
        
        if [ -n "$input_name" ]; then
            # Strict loop for S1
            while true; do
                if ask_int "      Set 1 Reps: "; then
                   s1_val=$INT_VAL
                   break
                else
                   echo -e "${RED}      You must enter reps for Set 1.${NC}"
                fi
            done
            
            # Strict loop for S2
            while true; do
                if ask_int "      Set 2 Reps: "; then
                   s2_val=$INT_VAL
                   break
                else
                   echo -e "${RED}      You must enter reps for Set 2.${NC}"
                fi
            done
            
            # Save all 3 data points
            set_val "LIFT_${i}_NAME" "$input_name"
            set_val "LIFT_${i}_S1" "$s1_val"
            set_val "LIFT_${i}_S2" "$s2_val"
            
            echo -e "      ${GREEN}-> Saved.${NC}"
        fi
        # Stop nagging after one interaction per run
        break 
    fi
done

if [ "$lifts_complete" -eq 3 ]; then
    echo -e "${GREEN}      -> ARM SESSION COMPLETE.${NC}"
fi

# ---------------------------------------------------------
# 4. NIGHT SQUATS (Starts at 7 PM / 19:00)
# ---------------------------------------------------------
if [ "$HOUR" -ge 19 ]; then
    done_nsq=$(get_val "N_SQUATS")
    if [ "$done_nsq" != "1" ]; then
        echo -e "${RED}[!] BEDTIME PREP.${NC} 15 Body Weight Squats."
        if ask_bool "Done?"; then
            set_val "N_SQUATS" "1"
            echo -e "${GREEN}-> Sleep well.${NC}"
        fi
    fi
fi

echo "---------------------------------------"

# ... existing Night Squats logic ...

# ---------------------------------------------------------
# 5. CLOUD SYNC
# ---------------------------------------------------------
echo -e "${CYAN}:: Syncing to Cloud ::${NC}"

# 1. Go to project dir
cd "$HOME/workout-tracker" || echo "Project not found!"

# 2. Run the sync script using Nix shell to ensure node/npm exists
# We use --pure false or just -p nodejs to use local cached deps if possible, 
# but calling npx directly is easiest if you are in the directory.

if command -v npx &> /dev/null; then
    npx ts-node scripts/sync-gatekeeper.ts
else
    # Fallback: Run inside a temporary nix-shell if npx is missing globally
    nix-shell -p nodejs --run "npx ts-node scripts/sync-gatekeeper.ts"
fi

echo "---------------------------------------"