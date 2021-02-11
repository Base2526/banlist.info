use Drupal\node\Entity\Node;

use voku\helper\HtmlDomParser;
use voku\helper\SimpleHtmlDomInterface;
use voku\helper\SimpleHtmlDomNode;
use voku\helper\SimpleHtmlDomNodeInterface;

use Drupal\backlist\Utils\Utils;

$query = \Drupal::entityQuery('node')
    ->condition('type', 'back_list');
  $nids = $query->execute();

foreach ($nids as $nid) {

    // $nid = '61906';
    $node = Node::load($nid);

    if(empty($node)){
        continue;
    }

    $field_id_blacklistseller = $node->get('field_id_blacklistseller')->getValue();
    if(!empty($field_id_blacklistseller)){
        $id_blacklistseller = $field_id_blacklistseller[0]['value'];

        $url = 'https://www.blacklistseller.com/report/report_preview/' . $id_blacklistseller;

        if(!Utils::is_404($url)){
            $html = HtmlDomParser::file_get_html($url);

            $table = $html->find('.table-borderless');
            foreach ($table->find('tr') as $row) {
                foreach($row->find('th') as $th) {
            
                    // วันโอนเงิน
                    if (str_contains($th->plaintext, 'วันโอนเงิน')){
                        $transfer_date = empty($row->find('td')[0]) ? '' : $row->find('td')[0]->plaintext;

                        // $datas['transfer_date'] = $transfer_date;

                        if(!empty($transfer_date)){
                            // $node = Node::load($nid);

                            // $time = strtotime('10/16/2003');
                            $node->set('field_transfer_date', date('Y-m-d', strtotime( $transfer_date ) )); // วันโอนเงิน

                            $node->save();
                            \Drupal::logger('update_node_transfer_date')->notice($nid);

                        }
                    }
                    
                }
            }
        }
    }

}
