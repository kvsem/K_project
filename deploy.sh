#!/bin/bash

deploy_server_list="kwanhee.me"

echo "usage : $(basename $0) [migrate]"
echo ""

while true; do
  echo "Select target server list and press [ENTER]: "
  echo "0) Quit"
  echo "1) $deploy_server_list"

  read selection
  if [ "$selection" == "1" ]; then
    server_list=$deploy_server_list
    break
  elif [ "$selection" == "0" ]; then
    exit 0
  fi
done

echo "update server list:"
for server in $(echo $server_list | tr "," "\n" ); do
  echo "- $server"
done
echo ""


while true; do
  #echo -n "Enter username and press [ENTER]: "
  echo "Enter username and press [ENTER]: "
  read username
  if [ "$username" != "" ]; then
    break
  fi
done

while true; do
  echo "Enter your password and press [ENTER]: "
  #read -s password
  stty -echo; read password; stty echo; echo

  if [ "$password" != "" ]; then
    break
  fi
done

for server in $(echo $server_list | tr "," "\n" ); do
  ssh -i "~/.ssh/id_rsa_personal" -t $username@$server "/bin/bash /home/ubuntu/K_project/K_project/bin/deploy.sh '$password' $1"
done


