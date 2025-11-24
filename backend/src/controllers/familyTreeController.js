const FamilyTree = require('../models/familyTree');
const FamilyMember = require('../models/familyMember');
const Media = require('../models/media');

// Tạo cây gia phả mới
exports.createFamilyTree = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, isPrivate } = req.body;
    
    const familyTree = await FamilyTree.create({
      userId,
      name,
      description,
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });
    
    res.json({ message: 'Tạo gia phả thành công', familyTree });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách gia phả của user
exports.getMyFamilyTrees = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const familyTrees = await FamilyTree.findAll({
      where: { userId },
      include: [{
        model: FamilyMember,
        as: 'members',
        attributes: ['id', 'name', 'avatar', 'generation']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(familyTrees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết gia phả
exports.getFamilyTree = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const familyTree = await FamilyTree.findOne({
      where: { id, userId },
      include: [{
        model: FamilyMember,
        as: 'members',
        include: [{
          model: Media,
          as: 'media',
          attributes: ['id', 'type', 'url', 'thumbnailUrl', 'title']
        }],
        order: [['generation', 'ASC'], ['createdAt', 'ASC']]
      }]
    });
    
    if (!familyTree) {
      return res.status(404).json({ error: 'Không tìm thấy gia phả' });
    }
    
    res.json(familyTree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật gia phả
exports.updateFamilyTree = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const familyTree = await FamilyTree.findOne({ where: { id, userId } });
    if (!familyTree) {
      return res.status(404).json({ error: 'Không tìm thấy gia phả' });
    }
    
    await familyTree.update(req.body);
    res.json(familyTree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa gia phả
exports.deleteFamilyTree = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const familyTree = await FamilyTree.findOne({ where: { id, userId } });
    if (!familyTree) {
      return res.status(404).json({ error: 'Không tìm thấy gia phả' });
    }
    
    // Xóa tất cả members và media liên quan
    const members = await FamilyMember.findAll({ where: { familyTreeId: id } });
    for (const member of members) {
      await Media.destroy({ where: { familyMemberId: member.id } });
    }
    await FamilyMember.destroy({ where: { familyTreeId: id } });
    
    await familyTree.destroy();
    res.json({ message: 'Đã xóa gia phả' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm thành viên vào gia phả
exports.addMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { familyTreeId } = req.params;
    const { parentId, name, gender, birthDate, deathDate, avatar, biography, relationship, generation } = req.body;
    
    // Kiểm tra gia phả thuộc user
    const familyTree = await FamilyTree.findOne({ where: { id: familyTreeId, userId } });
    if (!familyTree) {
      return res.status(404).json({ error: 'Không tìm thấy gia phả' });
    }
    
    const member = await FamilyMember.create({
      familyTreeId,
      parentId,
      name,
      gender,
      birthDate,
      deathDate,
      avatar,
      biography,
      relationship,
      generation: generation || 1
    });
    
    res.json({ message: 'Thêm thành viên thành công', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết thành viên
exports.getMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;
    
    const member = await FamilyMember.findOne({
      where: { id: memberId },
      include: [
        {
          model: FamilyTree,
          as: 'familyTree',
          where: { userId }
        },
        {
          model: Media,
          as: 'media',
          order: [['createdAt', 'DESC']]
        }
      ]
    });
    
    if (!member) {
      return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    }
    
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thành viên
exports.updateMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;
    
    const member = await FamilyMember.findOne({
      where: { id: memberId },
      include: [{
        model: FamilyTree,
        as: 'familyTree',
        where: { userId }
      }]
    });
    
    if (!member) {
      return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    }
    
    await member.update(req.body);
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa thành viên
exports.deleteMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;
    
    const member = await FamilyMember.findOne({
      where: { id: memberId },
      include: [{
        model: FamilyTree,
        as: 'familyTree',
        where: { userId }
      }]
    });
    
    if (!member) {
      return res.status(404).json({ error: 'Không tìm thấy thành viên' });
    }
    
    // Xóa tất cả media liên quan
    await Media.destroy({ where: { familyMemberId: memberId } });
    
    await member.destroy();
    res.json({ message: 'Đã xóa thành viên' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
