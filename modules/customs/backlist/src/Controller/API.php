<?php

/**
 * @file
 * Contains \Drupal\test_api\Controller\APIController.
 */

namespace Drupal\backlist\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\paragraphs\Entity\Paragraph;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use Drupal\user\Entity\User;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Drupal\file\Entity\File;

use Drupal\config_pages\Entity\ConfigPages;
use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;

use Drupal\backlist\Utils\Utils;
/**
 * Controller routines for test_api routes.
 * https://www.chapterthree.com/blog/custom-restful-api-drupal-8
 */
class API extends ControllerBase {

  public function CheckBanlist(Request $request){
    $response = array();
    $time1    = microtime(true);

    // if ( Utils::verify($request, FALSE) ) {
      $content = json_decode( $request->getContent(), TRUE );
      $type         = trim( $content['type'] );

      if(!empty( $type )){
        switch($type){
          // find by name, subname
          case '1':{
            $name         = trim( $content['name'] );
            $surname      = trim( $content['surname'] );

            if( empty($name) || empty($surname) ){

              // $query = \Drupal::entityTypeManager()->getStorage('node')->getQuery();
              $storage = \Drupal::entityTypeManager()->getStorage('node');
              $query = $storage->getQuery();
              $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
              $query->condition('type', 'back_list');

              $or = $query->orConditionGroup();
              if(!empty($name)){
                $or->condition('field_sales_person_name', $name, 'CONTAINS');
              }
              if(!empty($surname)){
                $or->condition('field_sales_person_surname', $surname, 'CONTAINS');
              }
              $query->condition($or);

              $query->condition('status', 1);
              $nids = $query->execute();

              $datas = array();
              foreach ($storage->loadMultiple($nids) as $node) {
                
                $datas[] = API::GetFieldNode($node);
              }

              $response['result']           = TRUE;
              $response['execution_time']   = microtime(true) - $time1;
              $response['count']            = count($datas);
              $response['datas']            = $datas;
            }else{
              $response['result']   = FALSE;
              $response['message']  = 'Empty name, subname.';
            }
            break;
          }

          // find by bank account
          case '2':{
            $bank_account = trim( $content['bank_account'] );
            if( !empty($bank_account) ){
              $pids = \Drupal::entityQuery('paragraph')
                      ->condition('type', 'item_merchant_bank_account')
                      ->condition('field_bank_account', $bank_account, 'CONTAINS')
                      ->execute();

              $datas = array();
              foreach ($pids as $pid) {
                $p = Paragraph::load($pid);
                $parent = $p->getParentEntity();

                if(!empty($parent)){
                  $node = Node::load($parent->id());
                  $datas[] = API::GetFieldNode($node);
                }
              }

              $response['result']           = TRUE;
              $response['execution_time']   = microtime(true) - $time1;
              $response['count']            = count($datas);
              $response['datas']            = $datas;
            }else{
              $response['result']   = FALSE;
              $response['message']  = 'Empty bank account.';
            }
            break;
          }

          default:{
            $response['result']   = FALSE;
            $response['message']  = 'Not match type.';
          }
        }
      }else{
        $response['result']   = FALSE;
        $response['message']  = 'Not match type.';
      }
      return new JsonResponse( $response );  
    // }

    // $response['result']   = FALSE;
    // return new JsonResponse( $response );
  }

  private function GetFieldNode($node){
    $data = array();
    $data['title'] = $node->label();

    // 2. ชื่อบัญชี-นามสกุล ผู้รับเงินโอน
    $sales_person_name = '';
    $field_sales_person_name = $node->get('field_sales_person_name')->getValue();
    if(!empty($field_sales_person_name)){
        $sales_person_name = $field_sales_person_name[0]['value'];
    }

    $data['name']  = $sales_person_name;

    // 3. นามสกุลผู้รับเงินโอน
    $sales_person_surname = '';
    $field_sales_person_surname = $node->get('field_sales_person_surname')->getValue();
    if(!empty($field_sales_person_surname)){
        $sales_person_surname = $field_sales_person_surname[0]['value'];
    }

    $data['surname']  = $sales_person_surname;

    // รายละเอียด
    $detail = $node->get('body')->getValue()[0]['value'];
    $data['detail']  = htmlspecialchars($detail) ;

    $merchant_bank_accounts = array();
    foreach ($node->get('field_merchant_bank_account')->getValue() as $mi=>$mv){
        
      $merchant_bank_account = array();
      $p = Paragraph::load( $mv['target_id'] );
      
      // เลขบัญชี
      $field_bank_account = $p->get('field_bank_account')->getValue();
      if(!empty($field_bank_account)){
          $bank_account = $field_bank_account[0]['value'];
          $merchant_bank_account['bank_account'] = $bank_account;
      } 

      // ธนาคาร/ระบบ Wallet
      $bank_wallet_target_id = $p->get('field_bank_wallet')->target_id;
      if(!empty($bank_wallet_target_id)){
        $bank_wallet = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($bank_wallet_target_id);
        $merchant_bank_account['bank_wallet'] = $bank_wallet->label();
      }
      
      $merchant_bank_accounts[] = $merchant_bank_account;
    }
    $data['banks']  = $merchant_bank_accounts;

    // รูปภาพประกอบ
    $images = array();
    foreach ($node->get('field_images')->getValue() as $imi=>$imv){
        // dpm( Utils::get_file_uri($imv['target_id']) );
        $images[] = Utils::get_file_url($imv['target_id']);
    }
    $data['images']  = $images;

    // ยอดเงิน
    $transfer_amount = number_format($node->get('field_transfer_amount')->getValue()[0]['value'], 2, '.', ',');

    $data['transfer_amount']  = $transfer_amount;
    $data['link']  = Utils::get_base_url() . 'node/' . $node->id();

    return $data;
  }
  
}