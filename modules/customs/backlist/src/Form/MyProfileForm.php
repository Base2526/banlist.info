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
      $this->userLg();
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

    if($uid == $current_user_id){
      $form['image_with_preview'] = [
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
  
      $form['user'] = array(
        '#type' => 'textfield',
        '#title' => t('User'),
        '#attributes' => array('placeholder' => t('User'), 'readonly' => 'readonly'),
        '#default_value' => $name,
        '#size' => 25,
      );
  
      $form['email'] = array(
        '#type' => 'textfield',
        '#title' => t('Email'),
        '#attributes' => array('placeholder' => t('Email'), 'readonly' => 'readonly'),
        '#default_value' => $email,
        '#size' => 25,
      );
  
      $form['send'] = array(
        '#type' => 'submit',
        '#name' => 'login',
        '#value' => $this->t('Save'),
      );
    }else{
      $form['user'] = array(
        '#type' => 'textfield',
        '#title' => t('User'),
        '#attributes' => array('placeholder' => t('User'), 'readonly' => 'readonly'),
        '#default_value' => $name,
        '#size' => 25,
      );
    } 
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
