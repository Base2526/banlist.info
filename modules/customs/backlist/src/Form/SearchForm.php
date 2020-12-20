<?php

/**
 * @file
 * Contains \Drupal\demo\Form\Multistep\MultistepTwoForm.
 */

namespace Drupal\backlist\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\FormBase;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
// use Drupal\paragraphs\Entity\Paragraph;

class SearchForm extends FormBase {

    /**
     * {@inheritdoc}.
     */
    public function getFormId() {
        return 'search_form';
    }

    /**
     * {@inheritdoc}.
     */
    public function buildForm(array $form, FormStateInterface $form_state) {
        // $route_match = \Drupal::service('current_route_match');
        // $keys = $route_match->getParameter('keys');
        // dpm($keys);

        // dpm(urlencode("https://geeksforgeeks.org/"));

        $form['filters'] = [
            '#type' => 'details',
            '#title' => $this->t('Filters'),
            '#open'  => true,
        ];
     
        $form['filters']['sales_person_name'] = [
            '#title'    => $this->t('Sales person name'),
            '#type'     => 'textfield',
            '#autocomplete_route_name' => 'backlist.autocomplete',
            '#autocomplete_route_parameters' => ['vid' => 'sales_person_name'],
        ];

        $form['filters']['product_type'] = [
            '#title'    => $this->t('Product type'),
            '#type'     => 'textfield',
            '#autocomplete_route_name' => 'backlist.autocomplete',
            '#autocomplete_route_parameters' => ['vid' => 'product_type'],
        ];

        $form['filters']['reportor'] = [
            '#title'    => $this->t('Reportor'),
            '#type'     => 'textfield',
            '#autocomplete_route_name' => 'backlist.autocomplete',
            '#autocomplete_route_parameters' => ['vid' => 'reportor'],
        ];

        // $form['filters']['marks'] = [
        //     '#title'         => 'Marks',
        //     '#type'          => 'search'
        // ];
        
        $form['filters']['actions'] = [
            '#type'       => 'actions'
        ];
     
        $form['filters']['actions']['submit'] = [
            '#type'  => 'submit',
            '#value' => $this->t('Filter')
        ];
       
        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {
        if ( $form_state->getValue('fname') == "") {
            $form_state->setErrorByName('from', $this->t('You must enter a valid first name.'));
        }elseif( $form_state->getValue('marks') == ""){
            $form_state->setErrorByName('marks', $this->t('You must enter a valid to marks.'));
        }
    }

    /**
     * {@inheritdoc}
    */
    public function submitForm(array & $form, FormStateInterface $form_state) {	  
        $field = $form_state->getValues();
        $fname = $field["fname"];
        $marks = $field["marks"];

        $page = \Drupal::request()->query->get('page');

        if(!empty($page)){
            $url = \Drupal\Core\Url::fromRoute('<front>')
            ->setRouteParameters(array('fname'=>$fname,'marks'=>$marks, 'page'=>$page));
        }else{
            $url = \Drupal\Core\Url::fromRoute('<front>')
            ->setRouteParameters(array('fname'=>$fname,'marks'=>$marks));
        }
        
        $form_state->setRedirectUrl($url); 
    }
}
