# bash

if [ "$1"!="" ]; then
	echo $1
	git add .
	git commit -m "$1"
	git push
else 
	echo "A commit message is required."
fi 