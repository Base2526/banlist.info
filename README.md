Backup, restore postgres in docker container
https://gist.github.com/gilyes/525cc0f471aafae18c3857c27519fc4b
Backup:
docker exec -t -u postgres your-db-container pg_dumpall -c > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

Restore:
cat your_dump.sql | docker exec -i your-db-container psql -Upostgres


Facebook Login
https://www.thaicreate.com/community/php-facebook-login-api-sdk-v5.html


Theme
https://www.drupal.org/docs/8/themes/barrio-bootstrap-4-drupal-89-theme/bootstrap-barrio-installation/installation
https://www.youtube.com/watch?v=59QBCzaH6JI&feature=youtu.be