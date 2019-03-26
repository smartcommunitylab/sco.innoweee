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
else
  Msg="$TSSRV Immagine Docker creazione errore $?"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
fi
mkdir tmp
docker run --rm -it -v "$(pwd)"/tmp:/tmp/build innoweee:latest sh -c "ionic cordova build browser; cp -r www/* build/;"
statusCode=$?
if [[ $statusCode -eq 0 ]]; then
  Msg="$TSSRV Build webapp completo"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
else
  Msg="$TSSRV Build webapp errore $?"
  curl -s -X POST $URL -d $CHAT -d "text=$Msg"
fi
echo $statusCode
exit $statusCode
