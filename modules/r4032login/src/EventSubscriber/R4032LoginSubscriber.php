<?php

namespace Drupal\r4032login\EventSubscriber;

use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\EventSubscriber\HttpExceptionSubscriberBase;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Path\PathMatcherInterface;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Url;
use Drupal\r4032login\Event\RedirectEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Component\Utility\Xss;

/**
 * Redirect 403 to User Login event subscriber.
 */
class R4032LoginSubscriber extends HttpExceptionSubscriberBase {

  /**
   * The configuration factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The request stack service.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  protected $requestStack;

  /**
   * The path matcher.
   *
   * @var \Drupal\Core\Path\PathMatcherInterface
   */
  protected $pathMatcher;

  /**
   * An event dispatcher instance to use for map events.
   *
   * @var \Symfony\Component\EventDispatcher\EventDispatcherInterface
   */
  protected $eventDispatcher;

  /**
   * The messenger service.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * Constructs a new R4032LoginSubscriber.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The configuration factory.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   The request stack service.
   * @param \Drupal\Core\Path\PathMatcherInterface $path_matcher
   *   The path matcher.
   * @param \Symfony\Component\EventDispatcher\EventDispatcherInterface $event_dispatcher
   *   The event dispatcher.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger service.
   */
  public function __construct(ConfigFactoryInterface $config_factory, AccountInterface $current_user, RequestStack $request_stack, PathMatcherInterface $path_matcher, EventDispatcherInterface $event_dispatcher, MessengerInterface $messenger) {
    $this->configFactory = $config_factory;
    $this->currentUser = $current_user;
    $this->requestStack = $request_stack;
    $this->pathMatcher = $path_matcher;
    $this->eventDispatcher = $event_dispatcher;
    $this->messenger = $messenger;
  }

  /**
   * {@inheritdoc}
   */
  protected function getHandledFormats() {
    return ['html'];
  }

  /**
   * Redirects on 403 Access Denied kernel exceptions.
   *
   * @param \Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   *   The Event to process.
   */
  public function on403(GetResponseEvent $event) {
    $config = $this->configFactory->get('r4032login.settings');

    $currentPath = $this->requestStack->getCurrentRequest()->getPathInfo();

    // Check if the path should be ignored.
    if (($noRedirectPages = trim($config->get('match_noredirect_pages')))
      && $this->pathMatcher->matchPath($currentPath, $noRedirectPages)
    ) {
      return;
    }

    // Retrieve the redirect path depending if the user is logged or not.
    if ($this->currentUser->isAnonymous()) {
      $redirectPath = $config->get('user_login_path');
    }
    else {
      $redirectPath = $config->get('redirect_authenticated_users_to');
    }

    if (!empty($redirectPath)) {
      // Determine if the redirect path is external.
      $externalRedirect = UrlHelper::isExternal($redirectPath);

      // Determine the url options.
      $options = [
        'absolute' => TRUE,
      ];

      // Determine the destination parameter
      // and add it as options for the url build.
      if ($config->get('redirect_to_destination')) {
        if ($externalRedirect) {
          $destination = Url::fromUserInput($currentPath, [
            'absolute' => TRUE,
          ])->toString();
        }
        else {
          $destination = substr($currentPath, 1);
        }

        if ($queryString = $this->requestStack->getCurrentRequest()->getQueryString()) {
          $destination .= '?' . $queryString;
        }

        if (empty($config->get('destination_parameter_override'))) {
          $options['query']['destination'] = $destination;
        }
        else {
          $options['query'][$config->get('destination_parameter_override')] = $destination;
        }
      }

      // Allow to alter the url or options before to redirect.
      $redirectEvent = new RedirectEvent($redirectPath, $options);
      $this->eventDispatcher->dispatch(RedirectEvent::EVENT_NAME, $redirectEvent);
      $redirectPath = $redirectEvent->getUrl();
      $options = $redirectEvent->getOptions();

      // Perform the redirection.
      if ($externalRedirect) {
        $url = Url::fromUri($redirectPath, $options)->toString();
        $response = new TrustedRedirectResponse($url);
      }
      else {
        // Show custom access denied message if set.
        if ($this->currentUser->isAnonymous() && $config->get('display_denied_message')) {
          $message = $config->get('access_denied_message');
          $messageType = $config->get('access_denied_message_type');
          $this->messenger->addMessage(Xss::filterAdmin($message), $messageType);
        }

        if ($redirectPath === '<front>') {
          $url = \Drupal::urlGenerator()->generate('<front>');
        }
        else {
          $url = Url::fromUserInput($redirectPath, $options)->toString();
        }

        $code = $config->get('default_redirect_code');
        $response = new RedirectResponse($url, $code);
      }

      $event->setResponse($response);
    }
  }

}
