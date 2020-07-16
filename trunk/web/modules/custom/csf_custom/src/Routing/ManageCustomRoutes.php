<?php

namespace Drupal\csf_custom\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

class ManageCustomRoutes extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    // Deny access to '/user/register'.
    if ($route = $collection->get('user.register')) {
      $route->setRequirement('_access', 'FALSE');
    }
    // Deny access to '/user/password'.
    if ($route = $collection->get('user.pass')) {
      $route->setRequirement('_access', 'FALSE');
    }

    foreach ($collection->all() as $route) {
      if (strpos($route->getPath(), '/manage/') === 0 && !$route->hasOption('_admin_route')) {
        $route->setOption('_admin_route', TRUE);
      }
    }
  }
}
