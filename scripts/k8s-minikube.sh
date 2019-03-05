#!/usr/local/bin/bash
# Before executing this script, you need to have your minikube cluster running

LWJ_PATH=~/Developer/playground/learn-with-jesus
LWJ_FE_PATH=${LWJ_PATH}/client
LWJ_BE_PATH=${LWJ_PATH}/server
LWJ_DB_PATH=${LWJ_PATH}/data
    
NAMESPACE=development
    
function start {
  local BUILD_APPS=$1

  if [ -z "$BUILD_APPS" ]; then
    BUILD_APPS=true
  fi

  minikube addons enable ingress
  if [ "$BUILD_APPS" = "true" ]; then
    npm run build-prod --prefix $LWJ_FE_PATH
  fi

  eval "$(minikube docker-env)"
  docker run -d -p 5000:5000 --restart=always --name registry registry:2
  docker build -t lwj-fe:v1 $LWJ_FE_PATH -q
  docker build -t lwj-be:v1 $LWJ_BE_PATH -q
  docker build -t lwj-db:v1 $LWJ_DB_PATH -q

  kubectl apply -f ${LWJ_PATH}/namespace-dev.yml
  kubectl config use-context $NAMESPACE

  kubectl apply -f ${LWJ_FE_PATH}/deployment-fe.yml
  kubectl apply -f ${LWJ_FE_PATH}/ingress-fe.yml
  kubectl apply -f ${LWJ_BE_PATH}/deployment-be.yml
  kubectl apply -f ${LWJ_DB_PATH}/deployment-db.yml

  # Todo: Add this automatically to /etc/hosts file
  # 192.168.64.129 lwj.com
  # 192.168.64.129 v2.lwj.com
}

function stop {
  kubectl delete namespace "$NAMESPACE"
}

function restart {
  local BUILD_APPS=$1
  stop
  start "$BUILD_APPS"
}

# $ eval "$(docker-machine env -u)"

function main {
  local ACTION=$1
  local BUILD_APPS=$2

  if [ -z "$ACTION" ]; then
    ACTION=start
  fi

  if [ "$ACTION" = "start" ]; then
    start "$BUILD_APPS"
  elif [ "$ACTION" = "stop" ]; then
    stop
  elif [ "$ACTION" = "restart" ]; then
    restart "$BUILD_APPS"
  fi

}

main "$1" "$2"