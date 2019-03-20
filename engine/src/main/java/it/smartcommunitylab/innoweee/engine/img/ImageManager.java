package it.smartcommunitylab.innoweee.engine.img;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.model.Component;
import it.smartcommunitylab.innoweee.engine.model.Player;

@org.springframework.stereotype.Component
public class ImageManager {
	private static final transient Logger logger = LoggerFactory.getLogger(ImageManager.class);
	
	@Autowired
	@Value("${image.path}")
	private String imagePath;

	public void storeRobotImage(Player player) throws Exception {
		BufferedImage joined = new BufferedImage(345, 541, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage imageHead = new BufferedImage(345, 120, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage imageChest = new BufferedImage(145, 275, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage imageArmL = new BufferedImage(100, 275, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage imageArmR = new BufferedImage(100, 275, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage imageLegs = new BufferedImage(345, 130, BufferedImage.TYPE_INT_ARGB_PRE);
		for(Component component : player.getRobot().getComponents().values()) {
			BufferedImage image = ImageIO.read(new File(imagePath + "/" + component.getImageUri()));
			switch (component.getType()) {
			case Const.ROBOT_HEAD:
				imageHead.createGraphics().drawImage(image.getScaledInstance(345, 120, Image.SCALE_SMOOTH), 0, 0, null);
				break;
			case Const.ROBOT_CHEST:
				imageChest.createGraphics().drawImage(image.getScaledInstance(145, 275, Image.SCALE_SMOOTH), 0, 0, null);
				break;
			case Const.ROBOT_ARML:
				imageArmL.createGraphics().drawImage(image.getScaledInstance(100, 275, Image.SCALE_SMOOTH), 0, 0, null);
				break;
			case Const.ROBOT_ARMR:
				imageArmR.createGraphics().drawImage(image.getScaledInstance(100, 275, Image.SCALE_SMOOTH), 0, 0, null);
				break;
			case Const.ROBOT_LEGS:
				imageLegs.createGraphics().drawImage(image.getScaledInstance(345, 130, Image.SCALE_SMOOTH), 0, 0, null);
				break;
			default:
				break;
			}
		}
		Graphics2D graph = joined.createGraphics();
		graph.drawImage(imageHead, 0, 0, null);
		graph.drawImage(imageArmR, 0, 128, null);
		graph.drawImage(imageChest, 100, 128, null);
		graph.drawImage(imageArmL, 245, 128, null);
		graph.drawImage(imageLegs, 0, 411, null);
		File joinedFile = new File(imagePath + "/" + player.getObjectId() + ".png");
    ImageIO.write(joined, "png", joinedFile);
    logger.info("storeRobotImage:{}", player.getObjectId());
    storeRobotThumbnail(player.getObjectId());
	}
	
	private void storeRobotThumbnail(String playerId) throws Exception {
		BufferedImage thumbnail = new BufferedImage(86, 135, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage image = ImageIO.read(new File(imagePath + "/" + playerId + ".png"));
		thumbnail.createGraphics().drawImage(image.getScaledInstance(86, 135, Image.SCALE_SMOOTH), 0, 0, null);
		File thumbFile = new File(imagePath + "/" + playerId + "-thumb.png");
    ImageIO.write(thumbnail, "png", thumbFile);	
    logger.info("storeRobotThumbnail:{}", playerId);
	}

}
