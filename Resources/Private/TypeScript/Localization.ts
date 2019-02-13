/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

import {SeverityEnum} from './Enum/Severity';
import * as $ from 'jquery';
import Icons = require('./Icons');
import Wizard = require('TYPO3/CMS/Backend/Wizard');

type LanguageRecord = {
  uid: number;
  title: string;
  flagIcon: string;
};

type SummaryColumns = {
  columns: { [key: number]: string };
  columnList: Array<number>;
};

type SummaryColPosRecord = {
  uid: number;
  title: string;
  icon: string;
};

type SummaryRecord = {
  columns: SummaryColumns;
  records: Array<Array<SummaryColPosRecord>>;
};

class Localization {
  private triggerButton: string = '.t3js-localize';
  private localizationMode: string = null;
  private sourceLanguage: number = null;
  private records: Array<any> = [];

  constructor() {
    $((): void => {
      this.initialize();
    });
  }

  private initialize(): void {
    const me = this;
    Icons.getIcon('actions-localize', Icons.sizes.large).done((localizeIconMarkup: string): void => {
      Icons.getIcon('actions-edit-copy', Icons.sizes.large).done((copyIconMarkup: string): void => {
        $(me.triggerButton).removeClass('disabled');

        $(document).on('click', me.triggerButton, (e: JQueryEventObject): void => {
          e.preventDefault();

          const $triggerButton = $(e.currentTarget);
          const actions: Array<string> = [];
          let slideStep1: string = '';

          if ($triggerButton.data('allowTranslate')) {
            actions.push(
              '<div class="row">'
              + '<div class="btn-group col-sm-3">'
              + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-translate">'
              + localizeIconMarkup
              + '<input type="radio" name="mode" id="mode_translate" value="localize" style="display: none">'
              + '<br>Translate</label>'
              + '</div>'
              + '<div class="col-sm-9">'
              + '<p class="t3js-helptext t3js-helptext-translate text-muted">' + TYPO3.lang['localize.educate.translate'] + '</p>'
              + '</div>'
              + '</div>',
            );
          }

          if ($triggerButton.data('allowCopy')) {
            actions.push(
              '<div class="row">'
              + '<div class="col-sm-3 btn-group">'
              + '<label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-copy">'
              + copyIconMarkup
              + '<input type="radio" name="mode" id="mode_copy" value="copyFromLanguage" style="display: none">'
              + '<br>Copy</label>'
              + '</div>'
              + '<div class="col-sm-9">'
              + '<p class="t3js-helptext t3js-helptext-copy text-muted">' + TYPO3.lang['localize.educate.copy'] + '</p>'
              + '</div>'
              + '</div>',
            );
          }

          slideStep1 += '<div data-toggle="buttons">' + actions.join('<hr>') + '</div>';
          Wizard.addSlide(
            'localize-choose-action',
            TYPO3.lang['localize.wizard.header_page']
              .replace('{0}', $triggerButton.data('page'))
              .replace('{1}', $triggerButton.data('languageName')),
            slideStep1,
            SeverityEnum.info,
          );
          Wizard.addSlide(
            'localize-choose-language',
            TYPO3.lang['localize.view.chooseLanguage'],
            '',
            SeverityEnum.info,
            ($slide: JQuery): void => {
              Icons.getIcon('spinner-circle-dark', Icons.sizes.large).done((markup: string): void => {
                $slide.html('<div class="text-center">' + markup + '</div>');

                this.loadAvailableLanguages(
                  parseInt($triggerButton.data('pageId'), 10),
                  parseInt($triggerButton.data('languageId'), 10),
                ).done((result: Array<LanguageRecord>): void => {
                  if (result.length === 1) {
                    // We only have one result, auto select the record and continue
                    this.sourceLanguage = result[0].uid;
                    Wizard.unlockNextStep().trigger('click');
                    return;
                  }

                  Wizard.getComponent().on('click', '.t3js-language-option', (optionEvt: JQueryEventObject): void => {
                    const $me = $(optionEvt.currentTarget);
                    const $radio = $me.find('input[type="radio"]');

                    this.sourceLanguage = $radio.val();
                    console.log('Localization.ts@132', this.sourceLanguage);
                    Wizard.unlockNextStep();
                  });

                  const $languageButtons = $('<div />', {class: 'row', 'data-toggle': 'buttons'});

                  for (const languageObject of result) {
                    $languageButtons.append(
                      $('<div />', {class: 'col-sm-4'}).append(
                        $('<label />', {class: 'btn btn-default btn-block t3js-language-option option'})
                          .text(' ' + languageObject.title)
                          .prepend(languageObject.flagIcon)
                          .prepend(
                            $('<input />', {
                              type: 'radio',
                              name: 'language',
                              id: 'language' + languageObject.uid,
                              value: languageObject.uid,
                              style: 'display: none;',
                            },
                          ),
                        ),
                      ),
                    );
                  }
                  $slide.empty().append($languageButtons);
                });
              });
            },
          );
          Wizard.addSlide(
            'localize-summary',
            TYPO3.lang['localize.view.summary'],
            '',
            SeverityEnum.info, ($slide: JQuery): void => {
              Icons.getIcon('spinner-circle-dark', Icons.sizes.large).done((markup: string): void => {
                $slide.html('<div class="text-center">' + markup + '</div>');
              });
              this.getSummary(
                parseInt($triggerButton.data('pageId'), 10),
                parseInt($triggerButton.data('languageId'), 10),
              ).done((result: SummaryRecord): void => {
                $slide.empty();
                this.records = [];

                const columns = result.columns.columns;
                const columnList = result.columns.columnList;

                columnList.forEach((colPos: number): void => {
                  if (typeof result.records[colPos] === 'undefined') {
                    return;
                  }

                  const column = columns[colPos];
                  const $row = $('<div />', {class: 'row'});

                  result.records[colPos].forEach((record: SummaryColPosRecord): void => {
                    const label = ' (' + record.uid + ') ' + record.title;
                    this.records.push(record.uid);

                    $row.append(
                      $('<div />', {'class': 'col-sm-6'}).append(
                        $('<div />', {'class': 'input-group'}).append(
                          $('<span />', {'class': 'input-group-addon'}).append(
                            $('<input />', {
                              type: 'checkbox',
                              'class': 't3js-localization-toggle-record',
                              id: 'record-uid-' + record.uid,
                              checked: 'checked',
                              'data-uid': record.uid,
                              'aria-label': label,
                            }),
                          ),
                          $('<label />', {
                            'class': 'form-control',
                            for: 'record-uid-' + record.uid,
                          }).text(label).prepend(record.icon),
                        ),
                      ),
                    );
                  });

                  $slide.append(
                    $('<fieldset />', {
                      'class': 'localization-fieldset',
                    }).append(
                      $('<label />').text(column).prepend(
                        $('<input />', {
                          'class': 't3js-localization-toggle-column',
                          type: 'checkbox',
                          checked: 'checked',
                        }),
                      ),
                      $row,
                    ),
                  );
                });

                Wizard.unlockNextStep();

                Wizard.getComponent().on('change', '.t3js-localization-toggle-record', (cmpEvt: JQueryEventObject): void => {
                  const $me = $(cmpEvt.currentTarget);
                  const uid = $me.data('uid');
                  const $parent = $me.closest('fieldset');
                  const $columnCheckbox = $parent.find('.t3js-localization-toggle-column');

                  if ($me.is(':checked')) {
                    this.records.push(uid);
                  } else {
                    const index = this.records.indexOf(uid);
                    if (index > -1) {
                      this.records.splice(index, 1);
                    }
                  }

                  const $allChildren = $parent.find('.t3js-localization-toggle-record');
                  const $checkedChildren = $parent.find('.t3js-localization-toggle-record:checked');

                  $columnCheckbox.prop('checked', $checkedChildren.length > 0);
                  $columnCheckbox.prop('indeterminate', $checkedChildren.length > 0 && $checkedChildren.length < $allChildren.length);

                  if (this.records.length > 0) {
                    Wizard.unlockNextStep();
                  } else {
                    Wizard.lockNextStep();
                  }
                }).on('change', '.t3js-localization-toggle-column', (toggleEvt): void => {
                  const $me = $(toggleEvt.currentTarget);
                  const $children = $me.closest('fieldset').find('.t3js-localization-toggle-record');

                  $children.prop('checked', $me.is(':checked'));
                  $children.trigger('change');
                });
              });
            },
          );

          Wizard.addFinalProcessingSlide((): void => {
            this.localizeRecords(
              parseInt($triggerButton.data('pageId'), 10),
              parseInt($triggerButton.data('languageId'), 10),
              this.records,
            ).done((): void => {
              Wizard.dismiss();
              document.location.reload();
            });
          }).done((): void => {
            Wizard.show();

            Wizard.getComponent().on('click', '.t3js-localization-option', (optionEvt: JQueryEventObject): void => {
              const $me = $(optionEvt.currentTarget);
              const $radio = $me.find('input[type="radio"]');

              if ($me.data('helptext')) {
                const $container = $(optionEvt.delegateTarget);
                $container.find('.t3js-helptext').addClass('text-muted');
                $container.find($me.data('helptext')).removeClass('text-muted');
              }
              this.localizationMode = $radio.val();
              Wizard.unlockNextStep();
            });
          });
        });
      });
    });
  }

  /**
   * Load available languages from page
   *
   * @param {number} pageId
   * @param {number} languageId
   * @returns {JQueryXHR}
   */
  private loadAvailableLanguages(pageId: number, languageId: number): JQueryXHR {
    return $.ajax({
      url: TYPO3.settings.ajaxUrls.page_languages,
      data: {
        pageId: pageId,
        languageId: languageId,
      },
    });
  }

  /**
   * Get summary for record processing
   *
   * @param {number} pageId
   * @param {number} languageId
   * @returns {JQueryXHR}
   */
  private getSummary(pageId: number, languageId: number): JQueryXHR {
    return $.ajax({
      url: TYPO3.settings.ajaxUrls.records_localize_summary,
      data: {
        pageId: pageId,
        destLanguageId: languageId,
        languageId: this.sourceLanguage,
      },
    });
  }

  /**
   * Localize records
   *
   * @param {number} pageId
   * @param {number} languageId
   * @param {Array<number>} uidList
   * @returns {JQueryXHR}
   */
  private localizeRecords(pageId: number, languageId: number, uidList: Array<number>): JQueryXHR {
    return $.ajax({
      url: TYPO3.settings.ajaxUrls.records_localize,
      data: {
        pageId: pageId,
        srcLanguageId: this.sourceLanguage,
        destLanguageId: languageId,
        action: this.localizationMode,
        uidList: uidList,
      },
    });
  }
}

export = new Localization();
