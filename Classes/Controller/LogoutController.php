<?php
namespace TYPO3\CMS\Backend\Controller;

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

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\FormProtection\FormProtectionFactory;
use TYPO3\CMS\Core\Utility\HttpUtility;

/**
 * Script Class for logging a user out.
 * Does not display any content, just calls the logout-function for the current user and then makes a redirect.
 *
 * @author Kasper Skårhøj <kasperYYYY@typo3.com>
 */
class LogoutController {

	/**
	 * Performs the logout processing
	 *
	 * @return void
	 */
	public function logout() {
		// Logout written to log
		$this->getBackendUser()->writelog(255, 2, 0, 1, 'User %s logged out from TYPO3 Backend', array($this->getBackendUser()->user['username']));
		/** @var \TYPO3\CMS\Core\FormProtection\BackendFormProtection $backendFormProtection */
		$backendFormProtection = FormProtectionFactory::get();
		$backendFormProtection->removeSessionTokenFromRegistry();
		$this->getBackendUser()->logoff();
		$redirect = GeneralUtility::sanitizeLocalUrl(GeneralUtility::_GP('redirect'));
		$redirectUrl = $redirect ? $redirect : 'index.php';
		HttpUtility::redirect($redirectUrl);
	}

	/**
	 * Returns the current BE user.
	 *
	 * @return \TYPO3\CMS\Core\Authentication\BackendUserAuthentication
	 */
	protected function getBackendUser() {
		return $GLOBALS['BE_USER'];
	}

}
