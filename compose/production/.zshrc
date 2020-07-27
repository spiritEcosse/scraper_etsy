# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block, everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# You may need to manually set your language environment
export LANG=en_US.UTF-8

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH
export PATH="${PATH}:/opt/depot_tools" 
export OH_MY_ZSH=~/.oh-my-zsh
export DRACULA_THEME=~/projects/opt/zsh
export SYSTEMD_EDITOR="/usr/bin/micro"

# Path to your oh-my-zsh installation.
  export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="powerlevel10k/powerlevel10k"
#ZSH_THEME="dracula"
#ZSH_THEME="amuse"
#ZSH_THEME="robbyrussell"

export TERM="xterm-256color"
#POWERLEVEL9K_MODE='awesome-fontconfig'
#POWERLEVEL9K_MODE='awesome-patched'
#POWERLEVEL9K_MODE='nerdfont-complete'
#RPROMPT="\$(~/.rvm/bin/rvm-prompt s i v g)%{$fg[yellow]%}[%*]"

P9K_MULTILINE_FIRST_PROMPT_PREFIX_ICON=$'Prompt \uF054 '
POWERLEVEL9K_LEFT_SEGMENT_SEPARATOR="\uE0B0"

#POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status)
#POWERLEVEL9K_CONTEXT_FOREGROUND="red"
#POWERLEVEL9K_CONTEXT_FOREGROUND="yellow"

#export PATH=/home/igor/pycharm-2019.1.2/bin:$PATH

DIR_GNOME_EXTENSIONS_USR=/usr/share/gnome-shell/extensions/
DIR_GNOME_EXTENSIONS_HOME=~/.local/share/gnome-shell/extensions/
# append history
setopt APPEND_HISTORY
# ignore dups in history
setopt HIST_IGNORE_ALL_DUPS
# ignore spaces in history
setopt HIST_IGNORE_SPACE
# reduce blanks in history
setopt HIST_REDUCE_BLANKS

setopt EXTENDED_HISTORY
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_FIND_NO_DUPS
setopt HIST_SAVE_NO_DUPS
setopt HIST_BEEP

# Colorize only the visual identifier
#POWERLEVEL9K_LOAD_CRITICAL_VISUAL_IDENTIFIER_COLOR="red"
#POWERLEVEL9K_LOAD_WARNING_VISUAL_IDENTIFIER_COLOR="yellow"
#POWERLEVEL9K_LOAD_NORMAL_VISUAL_IDENTIFIER_COLOR="green"

zsh_internet_signal(){
  local color
  local symbol="\uf7ba"
  if ifconfig en0 | grep inactive &> /dev/null; then
  color="%F{red}"
  else
  color="%F{blue}"
  fi
  echo -n "%{$color%}$symbol "
}

zsh_wifi_signal(){
    local signal=$(nmcli device wifi | grep yes | awk '{print $8}')
    local color='%F{yellow}'
    [[ $signal -gt 75 ]] && color='%F{green}'
    [[ $signal -lt 50 ]] && color='%F{red}'
    echo -n "%{$color%}\uf230  $signal%{%f%}" # \uf230 is 
}

zsh_ip(){
    echo -n "`ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p'`"
}

#Get the weather information from https://www.apixu.com/
#Just create a free account to have an API key
#Download jq do convert json
zsh_weather(){
  local weather=$(curl -s "http://api.weatherstack.com/current?access_key=cafdfd7bae8153150479f96dc2d279e9&query=Kiev")
  local temp=$(echo $weather | jq .current.feelslike)
  local condition=$(echo $weather | jq .current.weather_descriptions)
  local precip=$(echo $weather | jq .current.precip)
  local wind_speed=$(echo $weather | jq .current.wind_speed)
  local cloudcover=$(echo $weather | jq .current.cloudcover)
  #Default value
  local color='%F{green}'
  local symbol="\uf2c7"
  
  if [[ $condition == *"rain"* ]] ;
  then symbol="\uf043" ; color='%F{blue}'
  fi

  if [[ $condition == *"cloudy"* || $condition == *"Overcast"* ]] ;
  then symbol="\uf0c2" ; color='%F{grey}';
  fi

  if [[ $condition == *"Sunny"* ]] ;
  then symbol="\uf185" ; color='%F{yellow}';
  fi

  echo "%{$color%}$temp\u2103  $symbol  $precip mm  $wind_speed km/h  $cloudcover %#"
#  echo "`ansiweather -l Kiev`"
}

POWERLEVEL9K_PROMPT_ON_NEWLINE=true
POWERLEVEL9K_PROMPT_ADD_NEWLINE=true
POWERLEVEL9K_RPROMPT_ON_NEWLINE=true
#POWERLEVEL9K_SHORTEN_DIR_LENGTH=2
POWERLEVEL9K_SHORTEN_STRATEGY="truncate_beginning"
POWERLEVEL9K_RVM_BACKGROUND="black"
POWERLEVEL9K_RVM_FOREGROUND="249"
POWERLEVEL9K_RVM_VISUAL_IDENTIFIER_COLOR="red"
POWERLEVEL9K_TIME_BACKGROUND="black"
POWERLEVEL9K_TIME_FOREGROUND="249"
POWERLEVEL9K_TIME_FORMAT="\UF43A %D{%I:%M:%S  \UF133  %m.%d.%y}"
POWERLEVEL9K_RVM_BACKGROUND="black"
POWERLEVEL9K_RVM_FOREGROUND="249"
POWERLEVEL9K_RVM_VISUAL_IDENTIFIER_COLOR="red"
POWERLEVEL9K_STATUS_VERBOSE=false
POWERLEVEL9K_VCS_CLEAN_FOREGROUND='black'
POWERLEVEL9K_VCS_CLEAN_BACKGROUND='green'
POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND='black'
POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND='yellow'
POWERLEVEL9K_VCS_MODIFIED_FOREGROUND='white'
POWERLEVEL9K_VCS_MODIFIED_BACKGROUND='black'
POWERLEVEL9K_COMMAND_EXECUTION_TIME_BACKGROUND='black'
POWERLEVEL9K_COMMAND_EXECUTION_TIME_FOREGROUND='blue'
POWERLEVEL9K_FOLDER_ICON=''
POWERLEVEL9K_STATUS_OK_IN_NON_VERBOSE=true
POWERLEVEL9K_STATUS_VERBOSE=false
POWERLEVEL9K_COMMAND_EXECUTION_TIME_THRESHOLD=0
POWERLEVEL9K_VCS_UNTRACKED_ICON='\u25CF'
POWERLEVEL9K_VCS_UNSTAGED_ICON='\u00b1'
POWERLEVEL9K_VCS_INCOMING_CHANGES_ICON='\u2193'
POWERLEVEL9K_VCS_OUTGOING_CHANGES_ICON='\u2191'
POWERLEVEL9K_VCS_COMMIT_ICON="\uf417"
POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX="%F{blue}\u256D\u2500%f"
POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX="%F{blue}\u2570\uf460%f "
POWERLEVEL9K_CUSTOM_IP="zsh_ip"
POWERLEVEL9K_CUSTOM_IP_BACKGROUND="green"
POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX="%K{black}%F{black} `zsh_weather` %f%k%F{black}%f "
POWERLEVEL9K_CUSTOM_WIFI_SIGNAL="zsh_wifi_signal"

#POWERLEVEL9K_IP_INTERFACE=enp2s0

#POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(context os_icon custom_internet_signal custom_battery_status_joined ssh root_indicator dir dir_writable vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(command_execution_time history status custom_wifi_signal time core)
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon context load ram disk_usage ssh detect_virt background_jobs dir_writable root_indicator rbenv virtualenv pyenv public_ip custom_ip dir vcs)

HIST_STAMPS="mm/dd/yyyy"
DISABLE_UPDATE_PROMPT=true

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion. Case
# sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
	git
	archlinux
	extract
	colored-man-pages
	sudo
	history
	catimg
	npm
	pip
	python
)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# Preferred editor for local and remote sessions
#if [[ -n $SSH_CONNECTION ]]; then
#	export EDITOR='nano'
#else
export EDITOR='/usr/bin/micro'
#fi

export FCEDIT="$EDITOR"
export VISUAL="$EDITOR"
export SUDO_EDITOR="$EDITOR"

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

alias tb="taskbook"

# add this configuration to ~/.zshrc
export HISTFILE=~/.zsh_history  # ensure history file visibility
export HH_CONFIG=hicolor        # get more colors
bindkey -s "\C-r" "\eqhh\n"     # bind hh to Ctrl-r (for Vi mode check doc)
# bindkeys
bindkey '^[[A' up-line-or-search # up arrow for back-history-search
bindkey '^[[B' down-line-or-search # down arrow for fwd-history-search
bindkey '\e[1~' beginning-of-line # home
bindkey '\e[2~' overwrite-mode # insert
bindkey '\e[3~' delete-char # del
bindkey '\e[4~' end-of-line # end
bindkey '\e[5~' up-line-or-history # page-up
bindkey '\e[6~' down-line-or-history # page-down

if [[ $(cat '/etc/issue') == *'Arch Linux'* ]]
then
	# promptinit
	autoload -U promptinit promptinit
	# colors
	autoload -U colors colors
	# autocd
	setopt autocd
	# correct
	setopt CORRECT_ALL
	SPROMPT="Correct '%R' to '%r' ? ([Y]es/[N]o/[E]dit/[A]bort) "
	# disable
	# beeps unsetopt beep
	# calc
	autoload zcalc
	# pkgfile
	source /usr/share/doc/pkgfile/command-not-found.zsh

	# highlighting
	source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
	ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern)
	# brackets
	ZSH_HIGHLIGHT_STYLES[bracket-level-1]='fg=blue,bold'
	ZSH_HIGHLIGHT_STYLES[bracket-level-2]='fg=red,bold'
	ZSH_HIGHLIGHT_STYLES[bracket-level-3]='fg=yellow,bold'
	ZSH_HIGHLIGHT_STYLES[bracket-level-4]='fg=magenta,bold'
	# cursor
	#ZSH_HIGHLIGHT_STYLES[cursor]='bg=blue'
	# main
	# default
	ZSH_HIGHLIGHT_STYLES[default]='none' # стандартный цвет
	# unknown
	ZSH_HIGHLIGHT_STYLES[unknown-token]='fg=red' # неизвестная команда
	# command
	ZSH_HIGHLIGHT_STYLES[reserved-word]='fg=magenta,bold' # зарезервированное слово
	ZSH_HIGHLIGHT_STYLES[alias]='fg=yellow,bold' # алиас
	ZSH_HIGHLIGHT_STYLES[builtin]='fg=green,bold' # built-in функция (например, echo)
	ZSH_HIGHLIGHT_STYLES[function]='fg=green,bold' # функция, определенная в шелле
	ZSH_HIGHLIGHT_STYLES[command]='fg=green' # обычная команда
	ZSH_HIGHLIGHT_STYLES[precommand]='fg=blue,bold' # пре-команда (например, sudo в sudo cp ...)
	ZSH_HIGHLIGHT_STYLES[commandseparator]='fg=yellow' # разделитель команд, && || ;
	ZSH_HIGHLIGHT_STYLES[hashed-command]='fg=green' # команда, найденная в путях (hashed)
	ZSH_HIGHLIGHT_STYLES[single-hyphen-option]='fg=blue,bold' # флаги типа -*
	ZSH_HIGHLIGHT_STYLES[double-hyphen-option]='fg=blue,bold' # флаги типа --*
	# path
	ZSH_HIGHLIGHT_STYLES[path]='fg=cyan,bold' # станлартный путь
	ZSH_HIGHLIGHT_STYLES[path_prefix]='fg=cyan' # префикс пути
	ZSH_HIGHLIGHT_STYLES[path_approx]='fg=cyan' # примерный путь
	# shell
	ZSH_HIGHLIGHT_STYLES[globbing]='fg=cyan' # шаблон (например, /dev/sda*)
	ZSH_HIGHLIGHT_STYLES[history-expansion]='fg=blue' # подстановка из истории (команда, начинающаяся с !)
	ZSH_HIGHLIGHT_STYLES[assign]='fg=magenta' # присвоение
	ZSH_HIGHLIGHT_STYLES[dollar-double-quoted-argument]='fg=cyan' # конструкции типа "$VARIABLE"
	ZSH_HIGHLIGHT_STYLES[back-double-quoted-argument]='fg=cyan' # конструкции типа \
	ZSH_HIGHLIGHT_STYLES[back-quoted-argument]='fg=blue' # конструкции типа `command`
	# quotes
	ZSH_HIGHLIGHT_STYLES[single-quoted-argument]='fg=yellow,underline' # конструкции типа 'text'
	ZSH_HIGHLIGHT_STYLES[double-quoted-argument]='fg=yellow' # конструкции типа "text"
	# pattern
	#ZSH_HIGHLIGHT_PATTERNS+=('rm -rf *' 'fg=white,bold,bg=red')
	# root
	#ZSH_HIGHLIGHT_STYLES[root]='bg=red'
fi

export VIRTUALENVWRAPPER_PYTHON=`which python`
source $(which virtualenvwrapper.sh)
source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh

#normal=$(tput sgr0)                      # normal text
normal=$'\e[0m'                           # (works better sometimes)
bold=$(tput bold)                         # make colors bold/bright
red="$bold$(tput setaf 1)"                # bright red text
green=$(tput setaf 2)                     # dim green text
fawn=$(tput setaf 3); beige="$fawn"       # dark yellow text
yellow="$bold$fawn"                       # bright yellow text
darkblue=$(tput setaf 4)                  # dim blue text
blue="$bold$darkblue"                     # bright blue text
purple=$(tput setaf 5); magenta="$purple" # magenta text
pink="$bold$purple"                       # bright magenta text
darkcyan=$(tput setaf 6)                  # dim cyan text
cyan="$bold$darkcyan"                     # bright cyan text
gray=$(tput setaf 7)                      # dim white text
darkgray="$bold"$(tput setaf 0)           # bold black = dark gray text
white="$bold$gray"                        # bright white text
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=blue'

alias grey-grep="GREP_COLOR='1;30' grep --color=always"
alias red-grep="GREP_COLOR='1;31' grep --color=always"
alias green-grep="GREP_COLOR='1;32' grep --color=always"
alias yellow-grep="GREP_COLOR='1;33' grep --color=always"
alias blue-grep="GREP_COLOR='1;34' grep --color=always"
alias magenta-grep="GREP_COLOR='1;35' grep --color=always"
alias cyan-grep="GREP_COLOR='1;36' grep --color=always"
alias white-grep="GREP_COLOR='1;37' grep --color=always"



unpack () {
	if [ -f $1 ] ; then
	   case $1 in
	       *.tar.bz2)   tar xvjf $1    ;;
	       *.tar.gz)    folder=${1%.tar.gz} && mkdir $folder && tar xvzf $1 -C $folder && echo "extract to $folder" ;;
		   *.tar.xz) 	tar xvJf $1 ;;
	       *.bz2)       bunzip2 -k $1     ;;
	       *.rar)       unrar x $1       ;;
	       *.gz)        gunzip $1      ;;
	       *.tar)       tar xvf $1     ;;
		   *.tbz)		tar xjvf $1 ;;
	       *.tbz2)      tar xvjf $1    ;;
	       *.tgz)       tar xvzf $1    ;;
	       *.zip)       unar -d $1      ;;
	       *.Z)         uncompress $1  ;;
	       *.7z)        7z x $1        ;;
	       *)           echo "I don't know how to extract '$1'" ;;
	   esac
	else
		case $1 in *help)
			echo "Usage: unpack ARCHIVE_NAME" ;; *)
			echo "'$1' is not a valid file" ;;
		esac
	fi
}

pack () {
# rar a
	if [ $1 ]
	then
		case $1 in
			tar.bz2) tar -cjvf $2.tar.bz2 $2 ;;
			tar.gz) tar -czvf $2.tar.bz2 $2 ;;
			tar.xz) tar -cf - $2 | xz -9 -c - > $2.tar.xz ;;
			bz2) bzip2 -zk $2 ;;
			gz) gzip -c -9 -n $2 > $2.gz ;;
			tar) tar cpvf $2.tar $2 ;;
			tbz) tar cjvf $2.tar.bz2 $2 ;;
			tgz) tar czvf $2.tar.gz $2 ;;
			zip) zip -r $2.zip $2 ;;
			7z) 7z a $2.7z $2 ;;
			*help) echo "Usage: pack TYPE FILES" ;;
			*) echo "'$1' cannot be packed via pack()" ;;
		esac
	else
		echo "'$1' is not a valid file"
	fi
}

exec_basename() {
	basename ~+ | xargs echo -n
}

exec_basename_copy() {
	exec_basename | xclip -selection clipboard
}

exec_basename_upper() {
	exec_basename | tr '[:lower:]' '[:upper:]' | xclip -selection clipboard
}

exec_pwd() {
	pwd | xargs echo -n | xclip -selection clipboard
}

get_parent_branch() {
	git show-branch -a | grep '\*' | grep -v `git rev-parse --abbrev-ref HEAD` | head -n1 | sed 's/.*\[\(.*\)\].*/\1/' | sed 's/[\^~].*//'
}

ninja_test_microstocks() {
	cd ~/projects/microstocks/build/
	OUT_COMMAND=`ninja test`
	OUT=`echo $OUT_COMMAND | grep -oe "undefined reference to.*" | sed "s/[^a-zA-Z0-9]/_/g" | head -1`;

	if [ ! $OUT ]
	then
		OUT=`echo $OUT_COMMAND | grep -oe "error:[^;:]*" | sed "s/[^a-zA-Z0-9]/_/g" | head -1`;
	fi

	if [ ! $OUT ]
	then
		OUT=`echo $OUT_COMMAND | grep -oe ".*FAIL " | sed "s/[^a-zA-Z]/_/g" | head -1 | sed "s/_*//" | sed "s/__*/_/g"`;
	fi
	
	cd ~/projects/microstocks/
	BR=`git rev-parse --abbrev-ref HEAD`;
	
	if [[ $OUT != $BR ]]
	then
		if [[ $BR != 'master' && $BR != 'test' ]]
		then
			parent_br=$(git show-branch -a | grep '\*' | grep -v `git rev-parse --abbrev-ref HEAD` | head -n1 | sed 's/.*\[\(.*\)\].*/\1/' | sed 's/[\^~].*//')
			git add .
			git commit -m "fix: $BR"
			git push --set-upstream origin $BR
			[[ $parent_br = 'master' ]] && parent_br='test'
			git co $parent_br
			git merge $BR
			git push origin $parent_br
			git br -d $BR
			git push origin :$BR
		fi
	fi

	if [ $OUT ]
	then
		git rev-parse --verify $OUT;

		if [ $? -eq 0 ]; then
		    git co $OUT;
		else
		    git co -b $OUT;
		fi
	fi

	#cd ~/projects/microstocks/build && ninja test;
	echo $OUT_COMMAND | egrep -i --color=always '^.*ERROR.*$|^.*FAIL.*$|$' | GREP_COLOR='1;32' egrep -i --color=always 'YES*|$';
	cd ~/projects/microstocks/
}

export PYTHONPATH="${PYTHONPATH}:/usr/share/gmock/generator/"

HISTSIZE=10000000
SAVEHIST=10000000

source ~/.zsh/func

ord() {                                                                                                                                 
	LC_CTYPE=C printf '%d' "'$1"
}

function cd() {
  deactivate 2&> /dev/null
  builtin cd $1
  export PORT_WEB=$(export sum=0 && grep -o . <<< `zsh_pwd` | while read letter; do ((sum+=`ord $letter`)); done && echo $sum)
  export PORT_DB=$(export sum=1 && grep -o . <<< `zsh_pwd` | while read letter; do ((sum+=`ord $letter`)); done && echo $sum)

  if [[ $(lsvirtualenv -b | grep `zsh_pwd`) ]] ; then
# . ~/.virtualenvs/`zsh_pwd`/bin/activate  # commented out by conda initialize
  fi
}


#. /home/igor/projects/distro/install/bin/torch-activate
#. ~/.zshrc_

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/usr/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/usr/etc/profile.d/conda.sh" ]; then
        . "/usr/etc/profile.d/conda.sh"
    else
        export PATH="/usr/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

