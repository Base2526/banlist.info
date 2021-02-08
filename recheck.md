
use Drupal\node\Entity\Node; 

$query = \Drupal::entityQuery('node') ->condition('type', 'back_list'); 
$nids = $query->execute();
