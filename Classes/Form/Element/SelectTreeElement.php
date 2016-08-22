<?php
namespace TYPO3\CMS\Backend\Form\Element;

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

use TYPO3\CMS\Core\Authentication\BackendUserAuthentication;
use TYPO3\CMS\Core\Type\Bitmask\JsConfirmation;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Render data as a tree.
 *
 * Typically rendered for config type=select, renderType=selectTree
 */
class SelectTreeElement extends AbstractFormElement
{
    /**
     * Default height of the tree in pixels.
     *
     * @const
     */
    const DEFAULT_HEIGHT = 280;

    /**
     * Render tree widget
     *
     * @return array As defined in initializeResultArray() of AbstractNode
     * @see AbstractNode::initializeResultArray()
     */
    public function render()
    {
        $resultArray = $this->initializeResultArray();
        $parameterArray = $this->data['parameterArray'];
        $formElementId = md5($parameterArray['itemFormElName']);

        // Field configuration from TCA:
        $config = $parameterArray['fieldConf']['config'];
        $readOnly = !empty($config['readOnly']) ? 'true' : 'false';
        $exclusiveKeys = !empty($config['exclusiveKeys']) ? $config['exclusiveKeys'] : '';
        $exclusiveKeys = $exclusiveKeys . ',';
        $appearance = !empty($config['treeConfig']['appearance']) ? $config['treeConfig']['appearance'] : [];
        $expanded = !empty($appearance['expandAll']);
        $showHeader = !empty($appearance['showHeader']);
        if (isset($config['size']) && (int)$config['size'] > 0) {
            $height = min(count($config['items']), (int)$config['size']) * 20;
        } else {
            $height = static::DEFAULT_HEIGHT;
        }

        $treeWrapperId = 'tree_' . $formElementId;

        $html = [];
        $html[] = '<div class="typo3-tceforms-tree">';
        $html[] = '    <input class="treeRecord" type="hidden"';
        $html[] = '           ' . $this->getValidationDataAsDataAttribute($parameterArray['fieldConf']['config']);
        $html[] = '           data-formengine-input-name="' . htmlspecialchars($parameterArray['itemFormElName']) . '"';
        $html[] = '           data-relatedfieldname="' . htmlspecialchars($parameterArray['itemFormElName']) . '"';
        $html[] = '           data-table="' . htmlspecialchars($this->data['tableName']) . '"';
        $html[] = '           data-field="' . htmlspecialchars($this->data['fieldName']) . '"';
        $html[] = '           data-uid="' . (int)$this->data['vanillaUid'] . '"';
        $html[] = '           data-read-only="' . $readOnly . '"';
        $html[] = '           data-tree-exclusive-keys="' . htmlspecialchars($exclusiveKeys) . '"';
        $html[] = '           data-tree-expand-up-to-level="' . ($expanded ? '999' : '1') . '"';
        $html[] = '           data-tree-show-toolbar="' . $showHeader . '"';
        $html[] = '           name="' . htmlspecialchars($parameterArray['itemFormElName']) . '"';
        $html[] = '           id="treeinput' . $formElementId . '"';
        $html[] = '           value="' . htmlspecialchars(implode(',', $config['treeData']['selectedNodes'])) . '"';
        $html[] = '    />';
        $html[] = '</div>';
        $html[] = '<div id="' . $treeWrapperId . '" class="svg-tree-wrapper" style="height: ' . $height . 'px;"></div>';
        $html[] = '<script type="text/javascript">var ' . $treeWrapperId . ' = ' . $this->getTreeOnChangeJs() . '</script>';

        $resultArray['html'] = implode(LF, $html);

        $resultArray['requireJsModules']['selectTreeElement'] = 'TYPO3/CMS/Backend/FormEngine/Element/SelectTreeElement';

        return $resultArray;
    }

    /**
     * Generates JS code triggered on change of the tree
     *
     * @return string
     */
    protected function getTreeOnChangeJs()
    {
        $table = $this->data['tableName'];
        $field = $this->data['fieldName'];
        $parameterArray = $this->data['parameterArray'];
        $onChange = !empty($parameterArray['fieldChangeFunc']['TBE_EDITOR_fieldChanged']) ? $parameterArray['fieldChangeFunc']['TBE_EDITOR_fieldChanged'] : '';
        $onChange .= !empty($parameterArray['fieldChangeFunc']['alert']) ? $parameterArray['fieldChangeFunc']['alert'] : '';

        // Create a JavaScript code line which will ask the user to save/update the form due to changing the element.
        // This is used for eg. "type" fields and others configured with "requestUpdate"
        if (
            !empty($GLOBALS['TCA'][$table]['ctrl']['type'])
            && $field === $GLOBALS['TCA'][$table]['ctrl']['type']
            || !empty($GLOBALS['TCA'][$table]['ctrl']['requestUpdate'])
            && GeneralUtility::inList(str_replace(' ', '', $GLOBALS['TCA'][$table]['ctrl']['requestUpdate']), $field)
        ) {
            if ($this->getBackendUserAuthentication()->jsConfirmation(JsConfirmation::TYPE_CHANGE)) {
                $onChange = 'top.TYPO3.Modal.confirm(TBE_EDITOR.labels.refreshRequired.title, TBE_EDITOR.labels.refreshRequired.content).on("button.clicked", function(e) { if (e.target.name == "ok" && TBE_EDITOR.checkSubmit(-1)) { TBE_EDITOR.submitForm() } top.TYPO3.Modal.dismiss(); });';
            } else {
                $onChange .= 'if (TBE_EDITOR.checkSubmit(-1)){ TBE_EDITOR.submitForm() };';
            }
        }
        return 'function () {' . $onChange . '}';
    }

    /**
     * @return BackendUserAuthentication
     */
    protected function getBackendUserAuthentication()
    {
        return $GLOBALS['BE_USER'];
    }
}
