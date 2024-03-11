# Build the Bash command prompt

# Define the prompt build function
function build_PS1
{
	# Store the past command status code
	local past_command=$?

	# Define AINSI codes
	local bold='\[\e[1m\]'
	local plain='\[\e[22m\]'
	local red='\[\e[31m\]'
	local green='\[\e[32m\]'
	local white='\[\e[39m\]'

	# Determine the symbol of the prompt
	if [ $past_command = 0 ]
	then
		local symbol="$green✔$white"
	else
	  local symbol="$red✗$white"
	fi

	# Define the prompt
	PS1='${debian_chroot:+($debian_chroot)}'"$bold$symbol$plain "
}

# Define the use of the prompt build function
PROMPT_COMMAND=build_PS1