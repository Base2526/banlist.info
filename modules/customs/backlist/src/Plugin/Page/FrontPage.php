<?php
namespace Drupal\backlist\Plugin\Page;

use Drupal\Core\Controller\ControllerBase;
use Drupal\config_pages\Entity\ConfigPages;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\node\Entity\Node;

use Drupal\user\Entity\User;

use Drupal\backlist\Utils\Utils;

/**
 * Controller routines for page example routes.
 */
class FrontPage extends ControllerBase {
  /**
   * {@inheritdoc}
   */
  protected function getModuleName() {
    return 'front_page';
  }

  public function page() {
    /*
    $backlists = array();
    $nids_backlist = \Drupal::entityQuery('node')
                  ->condition('type','back_list')
                  ->condition('status', 1)
                  // ->condition('field_type_privilege','57942')
                  // ->range(0, 4)
                  ->sort('changed' , 'DESC')
                  ->execute();

    foreach( Node::loadMultiple($nids_backlist) as $node ) {
      $title        = $node->label();
      $owner_id     = $node->getOwnerId();
      $account      = User::load($owner_id);
      $backlists[]  = array( 'owner_id'  =>  $owner_id, 
                            'owner_name'=>  $account->getDisplayName(), 
                            'title'     =>  $title);
    }

    // $user = User::load(\Drupal::currentUser()->id());
    $block = [
      '#theme'  => 'front-page',
      '#cache'  => array("max-age" => 0),
      '#backlists' => $backlists,
      '#current_user_id' => \Drupal::currentUser()->id(),
    ];
    return $block;

    */

    //====load filter controller
	  $form['form'] = $this->formBuilder()->getForm('Drupal\backlist\Form\SearchForm');
 

    //Get parameter value while submitting filter form  
    $fname = \Drupal::request()->query->get('fname');
    $marks = \Drupal::request()->query->get('marks');

    // dpm( $fname );
    // dpm( $marks );

    // Create table header.
    $header = [
      // 'id' => $this->t('Id'),
      'fname' => $this->t('First Name'),
      'product_type'=>$this->t('Product Type'),
      'tel' => $this->t('Tel'),
      'bank_card_number' => $this->t('Bank card number'),
      'sname' => $this->t('Detail'),
      'balance'=> $this->t('Balance'),
      'date_post'=> $this->t('Date post'),	  
      // 'opt' =>$this->t('Operations')
    ];

    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
    $query->condition('status', 1);
    $query->sort('changed' , 'DESC');
    $query->tableSort($header);
    // Default value is 10.
    $query->pager(15);
    $nids = $query->execute();

    $date_formatter = \Drupal::service('date.formatter');
    $rows = [];
    foreach ($storage->loadMultiple($nids) as $node) {
      $row = [];
      // $row[] = $node->id();
      $row[] = $node->toLink();

      $row[] = '0988264820';
      $row[] = 'xxxxxxxxxx';
      $row[] = 'ดูรายละเอียด';//Utils::truncate($node->get('body')->value, 200);

      // image
      $row[] = [
        'data' => [
          '#theme' => 'image',
          // '#text' => $date_formatter->format($created),
          // '#attributes' => [
          //   'datetime' => $date_formatter->format($created, 'custom', \DateTime::RFC3339),
          // ],
          '#uri' => 'https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb',
          // '#alt' => $title,
          // '#title' => $title,
          '#width' => '80px',
        ],
      ];

      $created = $node->get('created')->value;
      $row[] = [
        'data' => [
          '#theme' => 'time',
          '#text' => $date_formatter->format($created),
          '#attributes' => [
            'datetime' => $date_formatter->format($created, 'custom', \DateTime::RFC3339),
          ],
        ],
      ];
      // $row[] = [
      //   'data' => $node->get('uid')->view(),
      // ];
      // $row[] = theme('image', array('path' => 'https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb'));
      // $rows[] = array('<img src="https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb" alt="photo" style="width:100px;height:300px">');
      
      

      // dpm();
      
      $rows[] = $row;
    }
	
  //  if($fname == "" && $marks ==""){
    $form['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,//get_students("All","",""),
      '#empty' => $this->t('No users found'),
    ];
  //  }else{
	//     $form['table'] = [
  //     '#type' => 'table',
  //     '#header' => $header,
  //     '#rows' => get_students("",$fname,$marks),
  //     '#empty' => $this->t('No records found'),
  //   ];
  //  }
    $form['pager'] = [
      '#type' => 'pager'
    ];
    return $form;
  }
}
