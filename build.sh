#!/bin/bash
set +x
statusCode=1
APP="innoweee-frontend-prod"
TSTAMP=$(date +%Y.%m.%d-%H.%M.%S)
TSSRV="$TSTAMP $APP:"
URL="https://api.telegram.org/bot${TG_TOKEN}/sendMessage"
CHAT="chat_id=${CHAT_ID}"
Msg="$TSSRV Build in corso"
curl -s -X POST $URL -d $CHAT -d "text=$Msg"
docker build -t innoweee:latest .
statusCode=$?
if [[ $statusCode -eq 0 ]]; then
  Msg="$TSSRV Immagine Docker creata con successo"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
  echo 0
else
  Msg="$TSSRV Immagine Docker creazione errore $?"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
  echo 1
fi
mkdir /home/ubuntu/jenkins/shared/tmp
docker run --rm -v /home/ubuntu/jenkins/shared/tmp:/tmp/build innoweee:latest sh -c "ionic cordova build browser; if [[ $? -eq 0 ]]; then cp -r www/* build/ && statusCode=0; else statusCode=1; fi; exit $statusCode;"
statusCode=$?
if [[ $statusCode -eq 0 ]]; then
  Msg="$TSSRV Build webapp completo"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
  echo 0
else
  Msg="$TSSRV Build webapp errore $?"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
  echo 1
fi
docker system prune -a -f
docker volume prune -f
echo $statusCode
exit $statusCode
