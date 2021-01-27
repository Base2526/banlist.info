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


- docker mmap() failed: [12] Cannot allocate memory
Composer require runs out of memory. PHP Fatal error: Allowed memory size of xxxxx bytes exhausted
https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-centos-7

Login with Google
https://console.developers.google.com/apis/credentials?project=banlist-info&folder=&organizationId=


Drapal 8-9 : Advanced Queue
https://ericpugh.dev/2020/drupal-advanced-queue-tutorial/


Excel
- composer phpoffice/phpspreadsheet
- Read multi images
  https://programming.vip/docs/php-reading-pictures-in-excel.html

- Read row & image
  https://github.com/rajaramtt/phpspreadsheet-Reading-Images-from-an-Excel-File

Twitter
 - https://twitteroauth.com/
 - https://processwire.com/talk/topic/21667-how-to-post-tweets-to-twitter-api-with-twitteroauth/