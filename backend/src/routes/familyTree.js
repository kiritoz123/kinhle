const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const familyTreeCtrl = require('../controllers/familyTreeController');
const mediaCtrl = require('../controllers/mediaController');
const upload = require('../middleware/upload');

// Family Tree routes
router.post('/', authenticate, familyTreeCtrl.createFamilyTree);
router.get('/', authenticate, familyTreeCtrl.getMyFamilyTrees);
router.get('/:id', authenticate, familyTreeCtrl.getFamilyTree);
router.put('/:id', authenticate, familyTreeCtrl.updateFamilyTree);
router.delete('/:id', authenticate, familyTreeCtrl.deleteFamilyTree);

// Family Member routes
router.post('/:familyTreeId/members', authenticate, familyTreeCtrl.addMember);
router.get('/members/:memberId', authenticate, familyTreeCtrl.getMember);
router.put('/members/:memberId', authenticate, familyTreeCtrl.updateMember);
router.delete('/members/:memberId', authenticate, familyTreeCtrl.deleteMember);

// Media in family member routes
router.post('/members/:familyMemberId/media/upload', authenticate, upload.single('file'), mediaCtrl.uploadToFamilyMember);
router.post('/members/:familyMemberId/media/text', authenticate, mediaCtrl.createTextMedia);
router.get('/members/:familyMemberId/media', authenticate, mediaCtrl.getFamilyMemberMedia);

module.exports = router;
