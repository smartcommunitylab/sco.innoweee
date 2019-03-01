package it.smartcommunitylab.innoweee.manager;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

import org.junit.Test;

public class ImageTest {
	
	@Test
	public void joinImages() throws Exception {
		BufferedImage joined = new BufferedImage(400, 500, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage imageArmL = ImageIO.read(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\armL0.png"));
		BufferedImage imageArmR = ImageIO.read(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\armR0.png"));
		BufferedImage imageHead = ImageIO.read(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\head0.png"));
		BufferedImage imageFeet = ImageIO.read(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\feet0.png"));
		BufferedImage imageLegs = ImageIO.read(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\legs0.png"));
		BufferedImage imageChest = ImageIO.read(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\chest0.png"));
		Graphics2D graph = joined.createGraphics();
		graph.drawImage(imageHead, 0, 0, null);
		graph.drawImage(imageArmR, 0, 100, null);
		graph.drawImage(imageChest, 100, 100, null);
		graph.drawImage(imageArmL, 300, 100, null);
		graph.drawImage(imageLegs, 0, 350, null);
		graph.drawImage(imageFeet, 0, 450, null);
		File joinedFile = new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\joined.png");
    ImageIO.write(joined, "png", joinedFile);
	}
	
	@Test
	public void createThumbnail() throws Exception {
		BufferedImage thumbnail = new BufferedImage(80, 100, BufferedImage.TYPE_INT_ARGB_PRE);
		BufferedImage image = ImageIO.read(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\joined.png"));
		thumbnail.createGraphics().drawImage(image.getScaledInstance(80, 100, Image.SCALE_SMOOTH), 0, 0, null);
		File thumbFile = new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\engine\\thumbnail.png");
    ImageIO.write(thumbnail, "png", thumbFile);		
	}
}
