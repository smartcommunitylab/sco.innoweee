#!/bin/bash
set +x
#ssh key
cat $key > sshkey
chmod 600 sshkey
statusCode=1
APP="innoweee-frontend-prod"
TSTAMP=$(date +%Y.%m.%d-%H.%M.%S)
TSSRV="$TSTAMP $APP:"
URL="https://api.telegram.org/bot${TG_TOKEN}/sendMessage"
CHAT="chat_id=${CHAT_ID}"
Msg="$TSSRV Deploy in corso"
curl -s -X POST $URL -d $CHAT -d "text=$Msg"
scp -r -i sshkey -o "StrictHostKeyChecking no" tmp/ $USR@$INTIP:/home/$USR/www > dpstatus
if [[ $? -eq 0 ]]; then
  statusCode=0
  Msg="$TSSRV Deploy ok"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
fi
rm sshkey
rm dpstatus
echo $statusCode
exit $statusCode
