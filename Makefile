MINIKUBE_SCRIPT_PATH=./scripts/k8s-minikube.sh

start:
	${MINIKUBE_SCRIPT_PATH} start

start-no-build:
	${MINIKUBE_SCRIPT_PATH} start false

stop:
	${MINIKUBE_SCRIPT_PATH} stop
	
restart:
	${MINIKUBE_SCRIPT_PATH} restart

restart-no-build:
	${MINIKUBE_SCRIPT_PATH} restart false

cluster-start: 
	minikube start

cluster-stop: 
	minikube stop

cluster-delete: 
	minikube delete

add-hosts:
	${MINIKUBE_SCRIPT_PATH} add-hosts
