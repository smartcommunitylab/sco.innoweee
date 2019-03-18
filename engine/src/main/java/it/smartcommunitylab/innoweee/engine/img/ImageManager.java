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
		BufferedImage imageArmL = null;
		BufferedImage imageArmR = null;
		BufferedImage imageHead = null;
		BufferedImage imageLegs = null;
		BufferedImage imageChest = null;
		for(Component component : player.getRobot().getComponents().values()) {
			switch (component.getType()) {
			case Const.ROBOT_HEAD:
				imageHead = ImageIO.read(new File(imagePath + "/" + component.getImageUri()));
				break;
			case Const.ROBOT_CHEST:
				imageChest = ImageIO.read(new File(imagePath + "/" + component.getImageUri()));
				break;
			case Const.ROBOT_ARML:
				imageArmL = ImageIO.read(new File(imagePath + "/" + component.getImageUri()));
				break;
			case Const.ROBOT_ARMR:
				imageArmR = ImageIO.read(new File(imagePath + "/" + component.getImageUri()));
				break;
			case Const.ROBOT_LEGS:
				imageLegs = ImageIO.read(new File(imagePath + "/" + component.getImageUri()));
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
		BufferedImage thumbnail = new BufferedImage(80, 100, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage image = ImageIO.read(new File(imagePath + "/" + playerId + ".png"));
		thumbnail.createGraphics().drawImage(image.getScaledInstance(80, 100, Image.SCALE_SMOOTH), 0, 0, null);
		File thumbFile = new File(imagePath + "/" + playerId + "-thumb.png");
    ImageIO.write(thumbnail, "png", thumbFile);	
    logger.info("storeRobotThumbnail:{}", playerId);
	}

}
