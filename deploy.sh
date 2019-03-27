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
scp -r -i sshkey -o "StrictHostKeyChecking no" /shared/tmp/* $USR@$INTIP:/home/$USR/innoweee/webApp/www
if [[ $? -eq 0 ]]; then
  statusCode=0
  Msg="$TSSRV Deploy ok"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
fi
rm sshkey
rm -rf /shared/tmp/
echo $statusCode
exit $statusCode
