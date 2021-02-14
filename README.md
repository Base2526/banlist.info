Backup, restore postgres in docker container
https://gist.github.com/gilyes/525cc0f471aafae18c3857c27519fc4b
Backup:
docker exec -t -u postgres your-db-container pg_dumpall -c > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

Restore:
cat your_dump.sql | docker exec -i your-db-container psql -Upostgres


Facebook Login
 - https://www.thaicreate.com/community/php-facebook-login-api-sdk-v5.html
 - https://github.com/facebook/react-native-fbsdk
 
Google Login
 - https://github.com/react-native-google-signin/google-signin

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
React-native : https://chaim-zalmy-muskal.medium.com/hi-6d328bbd550f


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


Memcaching redis
 https://chromatichq.com/blog/configuring-redis-caching-drupal-8


Count  > https://www.drupal.org/docs/8/api/database-api/dynamic-queries/count-queries
$time1    = microtime(true); 
$storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
     
    $and = $query->andConditionGroup();
            $and->condition('field_sales_person_name', $name, '=');
            $and->condition('field_sales_person_surname', $surname, '=');
        $query->condition($and);
$num_rows = $query->count()->execute();
dpm($num_rows);

$execution_time   = microtime(true) - $time1;

dpm( $execution_time  );


//////// delete by content type ///////////
  $query = \Drupal::entityQuery('node')
    ->condition('type', 'back_list');
  $nids = $query->execute();
  // dpm($nids);
  foreach ($nids as $nid) {
    \Drupal\node\Entity\Node::load($nid)->delete();
  }

//////// delete by content type ///////////


/// reset node start node = 1
UPDATE node SET nid = DEFAULT;
UPDATE node_revision SET nid = DEFAULT;
UPDATE node_field_data SET nid = DEFAULT;
UPDATE node_field_revision SET nid = DEFAULT;


/*
* hook_ENTITY_TYPE_update()
*/
// Case update config_pages > 
function bigcard_config_pages_update(Drupal\Core\Entity\EntityInterface $entity) {
  // $entity->getEntityTypeId() is value config_pages
  // dpm( $entity->getEntityTypeId() );
  // Clear && Rebuild cache from config_page update data.
  \Drupal::logger('bigcard_config_pages_update')->debug( "bigcard_config_pages_update" );
}


Postgre change performance
- https://www.enterprisedb.com/postgres-tutorials/how-tune-postgresql-memory
- https://github.com/docker-library/docs/tree/master/postgres

- ดูค่าที่เราปรับเปรียน
  SHOW shared_buffers;
  
  
  
Axois upload multi
- https://tuanitpro.com/how-to-upload-multiple-files-react-native/

Loading React-Native
 - https://www.npmjs.com/package/react-native-loading-spinner-overlay
 
Lazy Image React-Native 
 - https://www.npmjs.com/package/react-lazy-load-image-component
 
Elasticsearch Drupal 8-9
 - https://www.lullabot.com/articles/indexing-content-from-drupal-8-to-elasticsearch
 - https://medium.com/@ashutoshsngh67/intergration-of-elasticsearch-with-drupal-8-26d2ed56a47c
 - https://www.drupal.org/docs/8/modules/search-api/developer-documentation/executing-a-search-in-code
