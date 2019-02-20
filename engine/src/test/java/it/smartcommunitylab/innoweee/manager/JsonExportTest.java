package it.smartcommunitylab.innoweee.manager;

import java.io.File;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.Test;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import it.smartcommunitylab.innoweee.engine.common.Const;
import it.smartcommunitylab.innoweee.engine.model.Category;
import it.smartcommunitylab.innoweee.engine.model.CategoryMap;
import it.smartcommunitylab.innoweee.engine.model.Garbage;
import it.smartcommunitylab.innoweee.engine.model.GarbageMap;

public class JsonExportTest {
	@Test
	public void convertGarbageMap() throws Exception {
		GarbageMap garbageMap = new GarbageMap();
		File file = 
				new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\InnoWEEE-TrentinoPilot-items_weeks_materials.xlsx");
		XSSFWorkbook wb = new XSSFWorkbook(file);
		try {
			XSSFSheet sheet = wb.getSheet("Items & weeks");
			for(int i=1; i <= sheet.getLastRowNum(); i++) {
				System.out.println("converting row " + i);
				Row row = sheet.getRow(i);
				String category = row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getStringCellValue().trim();
				String nameEn = row.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getStringCellValue().trim();
				String nameIt = row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getStringCellValue().trim();
				double weight = row.getCell(5, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				Garbage garbage = new Garbage();
				garbage.setCategory(category);
				garbage.setWeight(weight);
				garbage.setId(nameEn);
				garbage.getName().put("en", nameEn);
				garbage.getName().put("it", nameIt);
				garbageMap.getItems().put(nameEn, garbage);
			}
		} finally {
			wb.close();
		}
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
		objectMapper.setSerializationInclusion(Include.NON_NULL);
		objectMapper.writeValue(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\garbageMap.json"), garbageMap);
	}
	
	@Test
	public void convertCategoryMap() throws Exception {
		CategoryMap categoryMap = new CategoryMap();
		File file = 
				new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\InnoWEEE-TrentinoPilot-items_weeks_materials.xlsx");
		XSSFWorkbook wb = new XSSFWorkbook(file);
		try {
			XSSFSheet sheet = wb.getSheet("Material Composition Trasposta");
			for(int i=1; i <= sheet.getLastRowNum(); i++) {
				System.out.println("converting row " + i);
				Row row = sheet.getRow(i);
				String categoryId = row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getStringCellValue().trim();
				double plastic = row.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double glass = row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double iron = row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double aluminium = row.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double copper = row.getCell(5, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double tin = row.getCell(6, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double nickel = row.getCell(7, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double silver = row.getCell(8, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double gold = row.getCell(9, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				double platinum = row.getCell(10, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK).getNumericCellValue();
				Category category = new Category();
				category.setId(categoryId);
				category.getMaterialsConversion().put(Const.MATERIAL_PLASTIC, plastic);
				category.getMaterialsConversion().put(Const.MATERIAL_GLASS, glass);
				category.getMaterialsConversion().put(Const.MATERIAL_IRON, iron);
				category.getMaterialsConversion().put(Const.MATERIAL_ALUMINIUM, aluminium);
				category.getMaterialsConversion().put(Const.MATERIAL_COPPER, copper);
				category.getMaterialsConversion().put(Const.MATERIAL_TIN, tin);
				category.getMaterialsConversion().put(Const.MATERIAL_NICKEL, nickel);
				category.getMaterialsConversion().put(Const.MATERIAL_SILVER, silver);
				category.getMaterialsConversion().put(Const.MATERIAL_GOLD, gold);
				category.getMaterialsConversion().put(Const.MATERIAL_PLATINUM, platinum);
				categoryMap.getCategories().put(categoryId, category);
			}
		} finally {
			wb.close();
		}
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
		objectMapper.setSerializationInclusion(Include.NON_NULL);
		objectMapper.writeValue(new File("C:\\Users\\micnori\\Documents\\Progetti\\Innoweee\\categoryMap.json"), categoryMap);
	}
}
