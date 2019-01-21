#!/bin/bash
# https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes

# If set to 'all' then it will copy all files from data/db
BACKUP_TYPE=$1

TIMESTAMP=$(date +%s)
MONGO_DB_CONTAINER=`docker ps -aqf name=learn-with-jesus_mongo_1`
BACKUP_FILENAME=backup-${TIMESTAMP}.tar
BACKUP_FILENAME_LATEST=backup-latest.tar

echo "Creating backup $BACKUP_FILENAME $BACKUP_TYPE"

if [ "$BACKUP_TYPE" = "all" ]; then
  BACKUP_DIR=$(pwd)/../data/backup-all
  docker run --rm \
    --volumes-from ${MONGO_DB_CONTAINER} \
    -v $BACKUP_DIR:/backup \
    ubuntu tar cvf backup/${BACKUP_FILENAME} /data/db
else
  BACKUP_DIR=$(pwd)/../data/backup
  docker run --rm \
    --volumes-from ${MONGO_DB_CONTAINER} \
    -v $BACKUP_DIR:/backup \
    ubuntu bash -c "cp -r /data/db /backup-tmp && cd backup-tmp && rm -rf journal diagnostic.data local* && cd .. && tar cvf backup/${BACKUP_FILENAME} /backup-tmp"
fi


echo "Creating backup $BACKUP_FILENAME_LATEST"

cd $BACKUP_DIR 
cp $BACKUP_FILENAME $BACKUP_FILENAME_LATEST
