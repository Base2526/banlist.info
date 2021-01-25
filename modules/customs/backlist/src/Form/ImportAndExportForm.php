<?php
/**
 * @file
 * Contains \Drupal\IMPORT_EXAMPLE\Form\ImportForm.
 */
namespace Drupal\backlist\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;

// https://www.fuseiq.com/blog/import-drupal-8-content-csv-file

class ImportAndExportForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'import_and_export_form';
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['description'] = array(
      '#markup' => '<p>Use this form to upload a CSV file of Data</p>',
    );

    $form['import_csv'] = array(
      '#type' => 'managed_file',
      '#title' => t('Upload file here'),
      '#upload_location' => 'public://importcsv/',
      '#default_value' => '',
      // "#upload_validators"  => array("file_validate_extensions" => array("csv", "xlsx")),
      '#states' => array(
        'visible' => array(
          ':input[name="File_type"]' => array('value' => t('Upload Your File')),
        ),
      ),
    );

    $form['actions']['#type'] = 'actions';


    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Upload CSV'),
      '#button_type' => 'primary',
    );

    return $form;
  }

  // public function deleteMasterStoreBranch(){
  //   $nids = \Drupal::entityQuery('node')->condition('type','master_store_branch')->execute();
  //   // $nodes =  Node::loadMultiple($nids);

  //   entity_delete_multiple('node', $nids);
  // }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    /*
    // $this->deleteMasterStoreBranch();
    // return;

    // Fetch the array of the file stored temporarily in database
    $csv_file = $form_state->getValue('import_csv');

    // Load the object of the file by it's fid 
    $file = File::load( $csv_file[0] );

    // Set the status flag permanent of the file object 
    $file->setPermanent();

    // Save the file in database 
    $file->save();


    return ;

    // You can use any sort of function to process your data. The goal is to get each 'row' of data into an array
    // If you need to work on how data is extracted, process it here.
    $data = $this->csvtoarray($file->getFileUri(), ',');

    // dpm($data);
    // $term = \Drupal\taxonomy\Entity\Term::create([
    //     'vid' => 'rw',
    //     'langcode' => 'en',
    //     'name' => 'My tag',
    //     'description' => [
    //       'value' => '<p>My description.</p>',
    //       'format' => 'full_html',
    //     ],
    //     'weight' => -1,
    //     'parent' => array(0),
    // ]);
    // $rw_n = $term->save();
    // dpm($rw_n);

    // dpm( count($data) );
    // dpm( $data );
    // return;
    $count_new_insert = 0;
    foreach($data as $row) {
        //$operations[] = ['\Drupal\IMPORT_EXAMPLE\addImportContent::addImportContentItem', [$row]];

        // dpm($row[2]);
        // $r = implode(",", $row);
        // dpm($r);

        $is_insert = TRUE;
        // $tid = 0;

        
        $nids = \Drupal::entityQuery('node')
                ->condition('type','master_store_branch')
                ->condition('field_store_code',  $row[3])
                ->condition('status', 1)
                ->execute();

        // dpm($nids);
        // $query = \Drupal::entityQuery('node')
        //     ->condition('status', 1)
        //     ->condition('changed', REQUEST_TIME, '<')
        //     ->condition('title', 'cat', 'CONTAINS')
        //     ->condition('field_tags.entity.name', 'cats');

        // $nids = $query->execute();

        if(empty($nids)){
            // $term = \Drupal\taxonomy\Entity\Term::load($tid);
            
            // [0] => 01
            // [1] => Hyper
            // [2] => 00217
            // [3] => พิบูลมังสาหาร
            // [4] => BIGC MARKET PHIBULMANGSAHARN
            // [5] => 41/9 ถนนสถิตย์นิมานการ ตำบลพิบูล อำเภอพิบูลมังสาหาร
            // [6] => จังหวัดอุบลราชธานี 34110
            // [7] => 
            // [8] => (045)442-330
            // [9] => 
            // [10] => 0107536000633

            // BU_TYPE, BU_NAME, BRANCH_ID,SHORT_NAME_THAI,SHORT_NAME,ADDR1,ADDR2,ADDR3,TELEP,FAX,TAXID
            

            // dpm(implode(",", $row));
            
            

            $bu_type = 0;
            switch($row[0]){
              case 1:{
                $bu_type = 1278;
              break;
              }

              case 3:{
                $bu_type = 1279;
              break;
              }

              case 5:{
                $bu_type = 1280;
              break;
              }
            }


            $node = Node::create([
              'type'        => 'master_store_branch',
              'status'     => 1,
              'title'       => $row[4], 

              'body'     => ['value' =>$row[6], 'format' => 'full_html'],
              // 'field_bu_type' => $row[0],
              'field_bu_type' =>  [
                'target_id' => $bu_type
              ],
              'field_bu_name_en' => $row[1],
              'field_bu_name_th' => $row[2],
              'field_store_code' => $row[3],

              'field_tel'=>$row[7],
              'field_title_eng'=>$row[5]
            ]);

            $node->save();
            $count_new_insert++;            
        }
    }
  
    // dpm($count_new_insert);

    // $batch = array(
    //   'title' => t('Importing Data...'),
    //   'operations' => $operations,
    //   'init_message' => t('Import is starting.'),
    //   'finished' => '\Drupal\IMPORT_EXAMPLE\addImportContent::addImportContentItemCallback',
    // );
    // batch_set($batch);

    drupal_set_message("Udpate %count_new_insert succesfully.", array('%count_new_insert'=>$count_new_insert),'status');
    */
  }

  public function csvtoarray($filename='', $delimiter){

    if(!file_exists($filename) || !is_readable($filename)) return FALSE;
    $header = NULL;


    $data = array();

    if (($handle = fopen($filename, 'r')) !== FALSE ) {
      while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
      {
        if(!$header){
          $header = $row;
        }else{
          $data[] = $row;//array_combine($header, $row);
        }
      }
      fclose($handle);
    }

    return $data;
  }

}