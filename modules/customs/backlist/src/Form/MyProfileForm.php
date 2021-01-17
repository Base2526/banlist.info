<?php

namespace Drupal\backlist\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\CssCommand;
use Drupal\Core\Ajax\InvokeCommand;
use Drupal\Core\Ajax\AfterCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\user\Entity\User;

/**
 * Controller routines for page example routes.
 */
class MyProfileForm extends FormBase {

  public $attachFileDescription = '<div class="attachmentDescription">Allowed extensions: jpg, jpeg, png, pdf <br>Maximum upload file size: 10 MB</div>';
  public $allowFileExtension    = array('jpg jpeg png pdf');
  public $allowFileSize         = array(10 * 1024 * 1024);
  /**
   * {@inheritdoc}
   */

   /**
   * Class constructor.
   */
  public function __construct() {
    $this->language = \Drupal::languageManager()->getCurrentLanguage()->getId();

    // $global_config = \Drupal\config_pages\Entity\ConfigPages::config('global_config');
    // if(isset( $global_config )){
    //     $this->is_debug =  $global_config->get('field_is_debug')->value;
    // }
  }

  public function getFormId() {
    return 'my_profile_form';
  }

  public function userLg(){
    $response = new RedirectResponse(\Drupal::url('user.login'));
    $response->send();
    return;
  }

  private function getBackListNode($current_user_id){
    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
    $query->condition('uid', $current_user_id);

    $nids = $query->execute();
    // foreach ($storage->loadMultiple($nids) as $node) {
    //   dpm($node->label());
    // }

    // dpm($nids);
    // 
    $form = array();
    $form['search_results']= array(
      '#type' => 'item',
      // '#prefix' => '<div>'.$this->t('Search results') . '<div>พบทั้งหมด 1 รายการ</div>',
      '#suffix' => '</div>',
    );

    $form['headers'] = array(
      '#type' => 'item',
      '#prefix' => '<table>
                      <tr>
                          <th>'.$this->t('สินค้า/ประเภท').'</th>
                          <th>'.$this->t('รายละเอียด').'</th>
                          <th>'.$this->t('ยอดเงิน').'</th>
                      </tr>',
      // '#suffix' => '</table>',
    );

    $summary = 0;
    if(empty($nids)){
        $form['headers'][] = array(
            '#type' => 'item',
            '#prefix' =>    '<tr>
                                <td>Empty result.</td>
                                <td></td>
                                <td></td>
                            </tr>',
            '#suffix' => '',
        );
    }else{
        foreach ($storage->loadMultiple($nids) as $node) {
            // ชื่อบัญชี-นามสกุล ผู้รับเงินโอน
            // $sales_person_name = '';
            // $field_sales_person_name = $node->get('field_sales_person_name')->getValue();
            // if(!empty($field_sales_person_name)){
            //     $sales_person_name = $field_sales_person_name[0]['value'];
            // }

            // // นามสกุลผู้รับเงินโอน
            // $sales_person_surname = '';
            // $field_sales_person_surname = $node->get('field_sales_person_surname')->getValue();
            // if(!empty($field_sales_person_surname)){
            //     $sales_person_surname = $field_sales_person_surname[0]['value'];
            // }

            $transfer_amount = $node->get('field_transfer_amount')->getValue()[0]['value'];

            $summary += $transfer_amount;

            // $form['headers'][] = array(
            //     '#type' => 'item',
            //     '#prefix' =>    '<tr>
            //                         <td><a href="/'. $this->language .'/node/'.$node->id().'/'. urlencode($name.'&'.$surname) .'">'. $node->label() .'</a></td>
            //                         <td>'. strip_tags($node->get('body')->getValue()[0]['value']) .'</td>
            //                         <td>'. number_format($transfer_amount, 2, '.', ',') .'</td>
            //                     </tr>',
            //     '#suffix' => '',
            // );

            $form['headers'][] = array(
                '#type' => 'item',
                '#prefix' =>    '<tr>
                                    <td><a href="/'. $this->language .'/node/'.$node->id().'/edit">'. $node->label() .'</a></td>
                                    <td>'. strip_tags($node->get('body')->getValue()[0]['value']) .'</td>
                                    <td>'. number_format($transfer_amount, 2, '.', ',') .'</td>
                                </tr>',
                '#suffix' => '',
            );
        }

        $form['headers'][] = array(
            '#type' => 'item',
            '#prefix' =>    '<tr>
                                <td></td>
                                <td class="filter-by-person-sammary">'.$this->t('ยอดรวม').'</td>
                                <td>'. number_format($summary, 2, '.', ',') .'</td>
                            </tr>',
            '#suffix' => '',
        );
        
    }

    $form['search_results']['#prefix'] = '<div>'.$this->t('รายงานที่สร้างไว้') . '<div>'. $this->t('พบทั้งหมด '.count($nids).' รายการ').'</div>';
    
    $form['headers']['#suffix'] = '</table>';

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#tree'] = TRUE;

    $current_route_match = \Drupal::service('current_route_match');
    $uid = $current_route_match->getParameter('uid'); 
    // $mode = empty($current_route_match->getParameter('mode')) ? 'add' : $current_route_match->getParameter('mode'); 

    $current_user_id = \Drupal::currentUser()->id();

    // dpm($uid);
    // dpm($mode);
    // dpm( $current_user_id );

    if(empty($uid)){
      $logged_in = \Drupal::currentUser()->isAuthenticated();
      if(empty($logged_in)){
        $this->userLg();
      }else{
        $uid = \Drupal::currentUser()->id();
      }
    }

    $user = User::load($uid);
    if(empty($user)){
      $this->userLg();
    }

    // $uid    = $user->get('uid')->value;
    $name   = $user->get('name')->value;
    $email  = $user->get('mail')->value;

    $image_with_preview_fids = array();  
    if (!$user->get('user_picture')->isEmpty()) {
      foreach ($user->get('user_picture')->getValue() as $key => $value){
        $image_with_preview_fids[] = $value['target_id'];
      }
    }
    // dpm( $image_with_preview_fids );
    $form['profile_fieldsets'] = array(
      '#type' => 'fieldset',
      '#title' => t('ข้อมูลส่วนบุคคล'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE
    );

    if($uid == $current_user_id){
      $form['profile_fieldsets']['image_with_preview'] = [
        '#type' => 'managed_file',
        '#title' => t('Picture profile'),
        '#upload_validators' => [
          'file_validate_extensions' => $this->allowFileExtension,
          'file_validate_size' => $this->allowFileSize,
        ],
        '#theme' => 'image_widget',
        '#preview_image_style' => 'medium',
        '#upload_location' => 'public://',
        '#required' => FALSE,
        '#default_value' => $image_with_preview_fids,
      ];
  
      $form['profile_fieldsets']['user'] = array(
        '#type' => 'textfield',
        '#title' => t('User'),
        '#attributes' => array('placeholder' => t('User'), 'readonly' => 'readonly'),
        '#default_value' => $name,
        '#size' => 25,
      );
  
      $form['profile_fieldsets']['email'] = array(
        '#type' => 'textfield',
        '#title' => t('Email'),
        '#attributes' => array('placeholder' => t('Email'), 'readonly' => 'readonly'),
        '#default_value' => $email,
        '#size' => 25,
      );
  
      $form['profile_fieldsets']['send'] = array(
        '#type' => 'submit',
        '#name' => 'login',
        '#value' => $this->t('Save'),
      );
    }else{
      $form['profile_fieldsets']['user'] = array(
        '#type' => 'textfield',
        '#title' => t('User'),
        '#attributes' => array('placeholder' => t('User'), 'readonly' => 'readonly'),
        '#default_value' => $name,
        '#size' => 25,
      );
    } 

    $form[] = $this->getBackListNode($current_user_id);
    
    return $form;
  }
 

  /**
  * {@inheritdoc}
  */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);

    // $email = $form_state->getValue('email');
    // if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    //     $form_state->setErrorByName('email', $this->t('กรุณากรอก อีเมลล์ OR Invalid email format.'));
    // }
  }

  /**
   * {@inheritdoc}
   */
   /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // $session = \Drupal::request()->getSession();
    $field= $form_state->getValues();

    // $user = User::load($this->uid);
    // $user->set('mail', $field['email']);
    // $user->set('field_cnth', $field['cnth']);
    
    // $image_with_preview = $form_state->getValue('image_with_preview');
    // if(!empty($image_with_preview)){
    //   $user->set('user_picture', $image_with_preview[0]);
    // }else{
    //   $user->set('user_picture', '');
    // }
    // $user->save();

    drupal_set_message("Update user succesfully.");
  }
}
