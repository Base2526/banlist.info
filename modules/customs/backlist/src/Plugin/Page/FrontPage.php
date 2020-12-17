<?php
namespace Drupal\backlist\Plugin\Page;

use Drupal\Core\Controller\ControllerBase;
use Drupal\config_pages\Entity\ConfigPages;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\node\Entity\Node;

use Drupal\user\Entity\User;

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
  }
}
