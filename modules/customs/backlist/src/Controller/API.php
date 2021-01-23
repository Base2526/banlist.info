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
use Drupal\Core\File\FileSystemInterface;

use \Datetime;

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

   /*
    use Drupal\backlist\Utils\Utils;

    $img = file_get_contents('sites/default/files/styles/large/public/2021-01/61270_135689222_2883573958549573_1784928971614446312_n.jpg');

    $data = base64_encode($img);
    // dpm($data); 

    // dpm(base64_decode($data)); 

    // $data = base64_decode($data);
    // dpm($data);

    $file = file_save_data(base64_decode($data), 'public://'. date('m-d-Y_hia') .'.png', FILE_EXISTS_RENAME);
    // dpm( $file );

    dpm(Utils::get_file_url($file->id()));
   */
  public function AddedBanlist(Request $request){
    $response = array();
    
    $time1    = microtime(true);

    // if ( Utils::verify($request, FALSE) ) {


    // $response['images']   = $content['images'];//\Drupal::request()->files->get('files', array());  ;

    /*
    $response['target'] = $request->query->get('attached_file');//isset(\Drupal::request()->request->get('attached_file')) ? \Drupal::request()->request->get('attached_file') : FALSE;

    $postReq = \Drupal::request()->request->all();

    $response['attached_file'] = $postReq['attached_file'];
    $response['postReq'] = mb_convert_encoding($postReq, 'UTF-8', 'UTF-8') ;

    // \Drupal::logger('added-banlist')->notice(serialize($postReq));

    // $response['$_FILES']  = serialize( $_FILES["photo"] );

    if(!empty($_FILES)){
      // $target = 'sites/default/files/'. $_FILES['attached_file']['name'];
      // move_uploaded_file( $_FILES['attached_file']['tmp_name'], $target);

      // $attached_file = file_save_data( file_get_contents( $target ), 'public://'. date('m-d-Y_hia') .'.png' , FILE_EXISTS_RENAME);

      $response['$_FILES']  = 'YES';
    }else{
      $response['$_FILES']  = 'NO';
    }
    */

    // $node = Node::create([
    //   'type'                   => 'user_deposit',
    //   'uid'                    => $uid,
    //   'status'                 => 1,
    //   'title'                  => "ฝากเงิน : " . $user->getUsername(),

    //   'field_huay_list_bank'   => $hauy_id_bank,        // ธนาคารของเว็บฯ ที่โอนเข้า
    //   'field_list_bank'        => $user_id_bank,        // ธนาคารที่ทำการโอนเงินเข้ามา
    //   'field_transfer_method'  => $transfer_method,     // ช่องทางการโอนเงิน
    //   'field_amount'           => $amount,              // จำนวนเงินที่โอน
    //   'field_attached_file'    => empty($attached_file) ? array() : array('target_id'=>$attached_file->id()),
    //   'field_date_transfer'    => date('Y-m-d\TH:i:s', $date_transfer/1000),       // วัน-เวลาโอน
    //   'body'                   => $note,                // หมายเหตุ
    // ]);
    // $node->save();

    /*
    product_type   : สินค้า/ประเภท
    transfer_amount: ยอดเงิน
    person_name    : ชื่อบัญชี ผู้รับเงินโอน
    person_surname : นามสกุล ผู้รับเงินโอน
    id_card_number : เลขบัตรประชาชนคนขาย
    selling_website: เว็บไซด์ประกาศขายของ
    transfer_date  : วันโอนเงิน
    details        : รายละเอียดเพิ่มเติม

    merchant_bank_account : บัญชีธนาคารคนขาย
    // options
    // 1: ธนาคารกรุงศรีอยุธยา
    // 2: ธนาคารกรุงเทพ
    // 3: ธนาคารซีไอเอ็มบี  
    // 4: ธนาคารออมสิน
    // 5: ธนาคารอิสลาม
    // 6: ธนาคารกสิกรไทย
    // 7: ธนาคารเกียรตินาคิน
    // 8: ธนาคารกรุงไทย
    // 9: ธนาคารไทยพาณิชย์
    // 10: Standard Chartered
    // 11: ธนาคารธนชาติ
    // 12: ทิสโก้แบงค์
    // 13: ธนาคารทหารไทย
    // 14: ธนาคารยูโอบี
    // 15: ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
    // 16: True Wallet
    // 17: พร้อมเพย์ (PromptPay)
    // 18: ธนาคารอาคารสงเคราะห์
    // 19: AirPay (แอร์เพย์)
    // 20: mPay
    // 21: 123 เซอร์วิส
    // 22: ธ.ไทยเครดิตเพื่อรายย่อย
    // 23: ธนาคารแลนด์แอนด์เฮ้าส์
    // 24: เก็บเงินปลายทาง 

    images                : รูปภาพประกอบ
    */

    /*
    product_type   : สินค้า/ประเภท
    transfer_amount: ยอดเงิน
    person_name    : ชื่อบัญชี ผู้รับเงินโอน
    person_surname : นามสกุล ผู้รับเงินโอน
    id_card_number : เลขบัตรประชาชนคนขาย
    selling_website: เว็บไซด์ประกาศขายของ
    transfer_date  : วันโอนเงิน
    details        : รายละเอียดเพิ่มเติม
    */
    $content        = json_decode( $request->getContent(), TRUE );

    $product_type   = trim( $content['product_type'] );       // สินค้า/ประเภท
    $transfer_amount= trim( $content['transfer_amount'] );    // ยอดเงิน
    $person_name    = trim( $content['person_name'] );        // ชื่อบัญชี ผู้รับเงินโอน
    $person_surname = trim( $content['person_surname'] );     // นามสกุล ผู้รับเงินโอน
    $id_card_number = trim( $content['id_card_number'] );     // เลขบัตรประชาชนคนขาย
    $selling_website= trim( $content['selling_website'] );    // เว็บไซด์ประกาศขายของ
    $transfer_date  = trim( $content['transfer_date'] );      // วันโอนเงิน
    $details        = trim( $content['details'] );            // รายละเอียดเพิ่มเติม
    $merchant_bank_account   = $content['merchant_bank_account']; // บัญชีธนาคารคนขาย
    $images         = $content['images'];            // รูปภาพประกอบ
/*
    { "product_type"   : "product_type 1",
      "transfer_amount": 500,
      "person_name"    : "person_name 1",
      "person_surname" : "person_surname 1",
      "id_card_number" : 2138123412,
      "selling_website": "http://banlist.info",
      "transfer_date"  : "2021-01-19",
      "details"        : "details 1",
      "images":[{"type": "type 1", "image":'', "name":"name 1", "extension": "png"}, 
                {"type": "type 2", "image":"dfasfd", "name":"name 2", "extension": "png"}, 
                {"type": "type 3", "image":"dfasfd", "name":"name 3", "extension": "png"}],

      "merchant_bank_account":[{"bank_account": "1234", "bank_wallet": 15}]
    }
*/
    if( empty(trim($product_type))   || 
        empty(trim($person_name))    || 
        empty(trim($person_surname)) ||
        empty(trim($transfer_date)) ||
        empty(trim($details)) ){

      $response['result']   = FALSE;
      $response['message']  = 'Empty product_type or person_name or person_surname or transfer_date or details';
      // $response['execution_time']   = microtime(true) - $time1;
      return new JsonResponse( $response );  
    }

    $merchant_bank_account_paragraphs =array();
    foreach ($merchant_bank_account as $ii=>$vv){
      $item_merchant = Paragraph::create([
        'type'                    => 'item_merchant_bank_account',
        'field_bank_account'      => $vv["bank_account"],
        'field_bank_wallet'       => $vv["bank_wallet"], 
      ]);
      $item_merchant->save();
      $merchant_bank_account_paragraphs[] = array('target_id'=> $item_merchant->id(), 'target_revision_id' => $item_merchant->getRevisionId());
    }
    
    $images_fids = array();
    foreach ($images as $imi=>$imv){
      $file = file_save_data(base64_decode($imv['image']), 'public://'. date('m-d-Y_hia') . '.' . ( empty($imv['extension']) ? 'png': $imv['extension']), FileSystemInterface::EXISTS_RENAME);
      $images_fids[] = array(
        'target_id' => $file->id(),
        'alt' => '',
        'title' => empty($imv['name']) ? '' : $imv['name']
      );
    }

    // $response['images_fids']  = $images_fids;
    /*
    $product_type   = trim( $content['product_type'] );       // สินค้า/ประเภท
    $transfer_amount= trim( $content['transfer_amount'] );    // ยอดเงิน
    $person_name    = trim( $content['person_name'] );        // ชื่อบัญชี ผู้รับเงินโอน
    $person_surname = trim( $content['person_surname'] );     // นามสกุล ผู้รับเงินโอน
    $id_card_number = trim( $content['id_card_number'] );     // เลขบัตรประชาชนคนขาย
    $selling_website= trim( $content['selling_website'] );    // เว็บไซด์ประกาศขายของ
    $transfer_date  = trim( $content['transfer_date'] );      // วันโอนเงิน
    $details        = trim( $content['details'] );            // รายละเอียดเพิ่มเติม
    $merchant_bank_account   = $content['merchant_bank_account']; // บัญชีธนาคารคนขาย
    $images         = $content['images'];                     // รูปภาพประกอบ
    */
    
    $node = Node::create([
      'type'                   => 'back_list',
      'uid'                    => \Drupal::currentUser()->id(),
      'status'                 => 1,
      'field_channel'          => 32,                // ถูกสร้างผ่านช่องทาง 31: Web, 32: Api

      'title'                  => $product_type,     // สินค้า/ประเภท
      'field_transfer_amount'  => $transfer_amount,  // ยอดเงิน
      'field_sales_person_name'=> $person_name,      // ชื่อบัญชี ผู้รับเงินโอน
      'field_sales_person_surname' => $person_surname, // นามสกุล ผู้รับเงินโอน
      'field_id_card_number'    => $id_card_number,  // เลขบัตรประชาชนคนขาย
      'field_selling_website'   => $selling_website, // เว็บไซด์ประกาศขายของ
      'field_transfer_date'     => $transfer_date,   // วันโอนเงิน
      'body'                    => $details,         // หมายเหตุ
      'field_merchant_bank_account' => $merchant_bank_account_paragraphs, // บัญชีธนาคารคนขาย
      'field_images'            => $images_fids      // รูปภาพประกอบ
    ]);
    $node->save();
    
    $response['result']   = TRUE;
    // $response['content']  = $content;
    $response['execution_time']   = microtime(true) - $time1;
    return new JsonResponse( $response );  
  }

  public function EveryDay(Request $request){
    $response = array();
    $time1    = microtime(true);

    $key = \Drupal::request()->query->get('key');
    if(empty($key) || $key != 'YmFubGlzdC5pbmZv'){
      $response['result']   = FALSE;
      return new JsonResponse( $response );  
    }

    \Drupal::logger('EveryDay')->notice('Cron EveryDay > %time', array( '%time' => (new DateTime())->format('Y-m-d H:i:s') ));
   
    $response['result']   = TRUE;
    $response['execution_time']   = microtime(true) - $time1;
    return new JsonResponse( $response );  
  }
}