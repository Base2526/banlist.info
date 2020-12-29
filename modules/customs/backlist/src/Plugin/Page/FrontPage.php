<?php
namespace Drupal\backlist\Plugin\Page;

use Drupal\Core\Controller\ControllerBase;
use Drupal\config_pages\Entity\ConfigPages;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\node\Entity\Node;

use Drupal\user\Entity\User;
use Drupal\Core\Url;
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

    $limit = 30;

    //====load filter controller
	  $form['form'] = $this->formBuilder()->getForm('Drupal\backlist\Form\SearchForm');
 

    /*
     $url = \Drupal\Core\Url::fromRoute('<front>')
            ->setRouteParameters(array( 'product_type'=>$product_type,
                                        'sales_person_name'=>$sales_person_name, 
                                        'reportor'=>$reportor, 
                                        'page'=>$page));
    */

    //Get parameter value while submitting filter form  
    $product_type       = \Drupal::request()->query->get('product_type');
    $sales_person_name  = \Drupal::request()->query->get('sales_person_name');
    $reportor           = \Drupal::request()->query->get('reportor');

    $current_page = empty(\Drupal::request()->query->get('page')) ? 0 : \Drupal::request()->query->get('page') ;

    // dpm( $product_type );
    // dpm( $sales_person_name );
    // dpm( $reportor );
    // dpm( $current_page );

    // Create table header.
    $header = [
      'product_type'      => $this->t('Product type'),        // สินค้า/ประเภท
      'sales_person_name' => $this->t('Sales person name'),   // ชื่อบัญชีผู้รับเงินโอน
      'details'           => $this->t('Details'),
      'transfer_amount'   => $this->t('Transfer amount'),     // ยอดเงิน
      'date_post'         => $this->t('Date post'),	  
      'reportor'          => $this->t('Reportor')
    ];

    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');

    if(!empty($product_type)){
      $query->condition('title', $product_type);
    }

    if(!empty($sales_person_name)){
      $query->condition('field_sales_person_name', $sales_person_name, 'CONTAINS');
    }

    if(!empty($reportor)){
      $userStorage = \Drupal::entityTypeManager()->getStorage('user');
      $uids = $userStorage->getQuery()
              ->condition('status', '1')
              ->condition('name', $reportor, '=')
              ->execute();

      if(!empty($uids)){
        $uid = reset($uids);

        $query->condition('uid', $uid);
      }
    }

    $query->condition('status', 1);
    $query->sort('changed' , 'DESC');
    $query->tableSort($header);

    $all_nids = $query->execute();
    // Default value is 10.
    $query->pager($limit);

    // $all_nids = $query->execute();
    $nids = $query->execute();
    
    $date_formatter = \Drupal::service('date.formatter');
    $rows = [];
    foreach ($storage->loadMultiple($nids) as $node) {
      $row = [];
      // $row[] = $node->id();

      // dpm( $Utils::truncate( ($node->get('body')->getValue()[0]['value']), 10) );
    
      $row[] = $node->toLink();
      // dpm( $node->get('field_sales_person_name')->getValue() );
      $row[] = Utils::truncate($node->get('field_sales_person_name')->getValue()[0]['value'], 50);

      $row[] = Utils::truncate($node->get('body')->getValue()[0]['value'], 300, '');
      // $row[] = $node->label();
      $row[] = $node->get('field_transfer_amount')->getValue()[0]['value'];
      // $row[] = 'ดูรายละเอียด';//Utils::truncate($node->get('body')->value, 200);


      // // image
      // $row[] = [
      //   'data' => [
      //     '#theme' => 'image',
      //     // '#text' => $date_formatter->format($created),
      //     // '#attributes' => [
      //     //   'datetime' => $date_formatter->format($created, 'custom', \DateTime::RFC3339),
      //     // ],
      //     '#uri' => 'https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb',
      //     // '#alt' => $title,
      //     // '#title' => $title,
      //     '#width' => '80px',
      //   ],
      // ];

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

      //'my_profile'
      // dpm( $node->getOwnerId() );
      // \Drupal\Core\Url::fromRoute('<front>')

      $ownerId = $node->getOwnerId();
      if(!empty($ownerId)){
        $user = User::load($ownerId);
        $row[] = [
          // 'data' => $node->get('uid')->view(),
          'data' => [
            '#theme' => 'links',
            '#attributes' => [
              'class' => [
                'links',
              ],
            ],
            '#links' => [
              [
                'title' => $user->get('name')->value,
                'url' => Url::fromRoute('my_profile.form', ['uid' => $ownerId]),
                'attributes' => [
                  'class' => [
                    'links__link',
                  ],
                ],
              ],
            ]
          ]
        ];
        // $row[] = theme('image', array('path' => 'https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb'));
        // $rows[] = array('<img src="https://www.drupal.org/files/styles/drupalorg_user_picture/public/user-pictures/picture-324696-1401239339.png?itok=LMwPjqdb" alt="photo" style="width:100px;height:300px">');
      
        // dpm();
        
        $rows[] = $row;
      }
    }
	
  //  if($fname == "" && $marks ==""){
    $form['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,//get_students("All","",""),
      '#empty' => $this->t('No data'),
      '#prefix' => '<div class="banlist-table">',
      '#suffix' => '</div>'
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

    $form['count'] = array(
      '#markup' => t('Displaying %start - %end of %all', array('%start'=>($current_page * $limit + 1), 
                                                               '%end'=>(($current_page * $limit) + $limit),
                                                               '%all'=>count($all_nids))),
      '#weight' => 100000,
    );
   
    return $form;
  }
}
