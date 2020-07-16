<?php

namespace Drupal\csf_custom\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class SettingsForm.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'csf_custom.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'csf_custom_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('csf_custom.settings');
    $social_map = _csf_custom_social_map();

    $form['social_settings'] = [
      '#type' => 'details',
      '#title' => $this->t('Social settings'),
      '#open' => TRUE,
    ];

    foreach ($social_map as $id => $data) {
      $title = !empty($data['title']) ? $data['title'] : '';
      $form['social_settings'][$id] = [
        '#type' => 'url',
        '#title' => $title,
        '#description' => $title,
        '#return_value' => TRUE,
        '#default_value' => $config->get($id),
      ];
    }

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $config = $this->config('csf_custom.settings');
    $social_map = _csf_custom_social_map();

    foreach ($social_map as $id => $data) {
      $config->set($id, $form_state->getValue($id));
    }

    $config->save();
  }
}
