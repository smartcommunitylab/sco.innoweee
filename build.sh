#!/bin/bash
set +x
#ssh key
cat $key > sshkey
chmod 600 sshkey
statusCode=1
APP="innoweee-backend-prod"
TSTAMP=$(date +%Y.%m.%d-%H.%M.%S)
TSSRV="$TSTAMP $APP:"
cd engine
RELEASE=$(sed -E -n '/<artifactId>(engine)<\/artifactId>.*/{n;p}' pom.xml | grep -Eo '\d\.\d')
echo $RELEASE
Msg="$TSSRV Build in corso"
URL="https://api.telegram.org/bot${TG_TOKEN}/sendMessage"
CHAT="chat_id=${CHAT_ID}"
curl -s -X POST $URL -d $CHAT -d "text=$Msg"
ssh -i sshkey -o "StrictHostKeyChecking no" $USR@$IP "sudo service innoweee-engine stop && /home/$USR/sources/deploy-innoweee-engine.sh && echo VER=${RELEASE} > /home/dev/innoweee-engine-env && sudo service innoweee-engine start "
statusCode=$?
if [[ $statusCode -eq 0 ]]; then
  Msg="$TSSRV Aggiornamento completato"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
else
  Msg="$TSSRV Aggiornamento non riuscito"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
fi
rm sshkey
echo $statusCode
exit $statusCode
