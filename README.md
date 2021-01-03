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

Theme bootstrap_barrio status_messages
https://www.drupal.org/project/bootstrap_barrio/issues/3037643

https://gist.github.com/bdlangton/e826276a0c78d9a89d8dec23dd0c7683

Secure Apache with Let's Encrypt on Debian 10
https://linuxize.com/post/secure-apache-with-let-s-encrypt-on-debian-10/


Google OAuth client created
- Your Client ID
693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com
- Your Client Secret
zaqrtYlJrf-1215zE42xBBIe