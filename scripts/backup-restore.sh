#!/bin/bash
# https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes

# If $1 set to 'all' then take the latest complete backup
BACKUP_TYPE=$1
BACKUP_FILENAME=$2

BACKUP_FILENAME_LATEST="backup-latest.tar"
if [ -z $BACKUP_FILENAME ]; then
  BACKUP_FILENAME=$BACKUP_FILENAME_LATEST
fi

MONGO_DB_CONTAINER=`docker ps -aqf name=learn-with-jesus_mongo_1`

echo "Restoring from backup $BACKUP_DIR/$BACKUP_FILENAME"

# DELETE EXISTENT DB AND COPY BACKUP
if [ "$BACKUP_TYPE" = "all" ]; then
  BACKUP_DIR=$(pwd)/../data/backup-all
  docker run --rm \
    --volumes-from ${MONGO_DB_CONTAINER} \
    -v $BACKUP_DIR:/backup \
    ubuntu bash -c "cd data/db && rm -rf * && cd ../../ && tar xvf backup/${BACKUP_FILENAME}"
else
  BACKUP_DIR=$(pwd)/../data/backup
  docker run --rm \
    --volumes-from ${MONGO_DB_CONTAINER} \
    -v $BACKUP_DIR:/backup \
    ubuntu bash -c "cd data/db && rm -rf * && cd ../../ && tar xvf backup/${BACKUP_FILENAME} \
    && cp -r /backup-tmp/** /data/db"
fi




