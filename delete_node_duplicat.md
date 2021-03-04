use Drupal\node\Entity\Node;
$query = \Drupal::entityQuery('node')
    ->condition('type', 'back_list');
  $nids = $query->execute();

foreach ($nids as $nid) {

    $node = Node::load($nid);


    if(empty($node)){
        continue;
    }

    $title        = $node->label();

    $body = $node->get('body')->getValue();
    if(!empty($body)){
        $body = $body[0]['value'];
    }
    
    $name = '';
    $field_sales_person_name = $node->get('field_sales_person_name')->getValue();
    if(!empty($field_sales_person_name)){
        $name = $field_sales_person_name[0]['value'];
    }

    $surname = '';
    $field_sales_person_surname = $node->get('field_sales_person_surname')->getValue();
    if(!empty($field_sales_person_surname)){
        $surname = $field_sales_person_surname[0]['value'];
    }


    $selling_website = '';
    $field_selling_website = $node->get('field_selling_website')->getValue();
    if(!empty($field_selling_website)){
        $selling_website = $field_selling_website[0]['value'];
    }

    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
     

    $and = $query->andConditionGroup();

            if(!empty($title)){
                $and->condition('title', $title, '=');
            }

            if(!empty($body)){
                $and->condition('body', $body, '=');
            }

            if(!empty($name)){
                $and->condition('field_sales_person_name', $name, '=');
            }

            if(!empty($surname)){
                $and->condition('field_sales_person_surname', $surname, '=');
            }

            if(!empty($selling_website)){
                $and->condition('field_selling_website', $selling_website, '=');
            }

    $query->condition($and);


    $ns = $query->execute();

    if(count($ns) > 1){

      $ns = array_diff( $ns, [$nid] );
      foreach ($ns as $ni) {
       $nnm= Node::load($ni);

        if ($nnm) {
        
         \Drupal::logger('delete_node_duplicat')->notice($ni);
         // $nnm->delete();
        }
      }
    }
}
