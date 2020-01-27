package it.smartcommunitylab.innoweee.engine.common;

public class Const {
	public static final String ERRORTYPE = "errorType";
	public static final String ERRORMSG = "errorMsg";
	
	public static final String SYSTEM_DOMAIN = "SYSTEM";
	
	public static final String ROLE_ADMIN = "admin";
	public static final String ROLE_USER = "user";
	public static final String ROLE_OWNER = "owner";
	public static final String ROLE_SCHOOL_OWNER = "school-owner";
	public static final String ROLE_SCHOOL_TEACHER = "school-teacher";
	public static final String ROLE_SCHOOL_PARENT = "school-parent";
	public static final String ROLE_COLLECTOR_OPERATOR = "collector-operator";
	
	public static final String AUTH_ACTION_READ = "READ";
	public static final String AUTH_ACTION_ADD = "ADD";
	public static final String AUTH_ACTION_UPDATE = "UPDATE";
	public static final String AUTH_ACTION_DELETE = "DELETE";
	
	public static final String AUTH_RES_Auth = "Auth";
	public static final String AUTH_RES_Image = "Image";
	public static final String AUTH_RES_School = "School";
	public static final String AUTH_RES_Institute = "Institute";
	public static final String AUTH_RES_CategoryMap = "CategoryMap";
	public static final String AUTH_RES_GarbageMap = "GarbageMap";
	public static final String AUTH_RES_Catalog = "Catalog";
	public static final String AUTH_RES_Game = "Game";
	public static final String AUTH_RES_Game_GarbageCollection = "Game-GarbageCollection";
	public static final String AUTH_RES_Game_Link = "Game-Link";
	public static final String AUTH_RES_Game_Player = "Game-Player";
	public static final String AUTH_RES_Game_Robot = "Game-Robot";
	public static final String AUTH_RES_Game_Item = "Game-Item";
	public static final String AUTH_RES_Game_Point = "Game-Point";
	
	public static final String MEDIA_LINK = "link";
	public static final String MEDIA_VIDEO = "video";
	public static final String MEDIA_IMAGE = "image";
	public static final String MEDIA_FILE = "file";
	
	public static final String EVENT_START_COLL = "link";
	public static final String EVENT_STOP_COLL = "link";
	public static final String EVENT_ADD_GARBAGE = "video";
	
	public static final String MATERIAL_PLASTIC = "plastic";
	public static final String MATERIAL_GLASS = "glass";
	public static final String MATERIAL_IRON = "iron";
	public static final String MATERIAL_ALUMINIUM = "aluminium";
	public static final String MATERIAL_COPPER = "copper";
	public static final String MATERIAL_TIN = "tin";
	public static final String MATERIAL_NICKEL = "nickel";
	public static final String MATERIAL_SILVER = "silver";
	public static final String MATERIAL_GOLD = "gold";
	public static final String MATERIAL_PLATINUM = "platinum";
	
	public static final String COIN_REDUCE = "reduceCoin";
	public static final String COIN_REUSE = "reuseCoin";
	public static final String COIN_RECYCLE = "recycleCoin";
	
	public static final String ROBOT_HEAD = "head";
	public static final String ROBOT_CHEST = "chest";
	public static final String ROBOT_ARMR = "armR";
	public static final String ROBOT_ARML = "armL";
	public static final String ROBOT_LEGS = "legs";
	
	public static final String ACTION_BUILD_ROBOT = "build_robot";
	public static final String ACTION_ADD_POINT = "add_point";
	public static final String ACTION_ADD_CONTRIBUTION = "add_contribution";
	
	public static final String ERROR_CODE_TOKEN = "EC01:";
	public static final String ERROR_CODE_EMAIL = "EC02:";
	public static final String ERROR_CODE_USER = "EC03:";
	public static final String ERROR_CODE_ROLE = "EC04:";
	public static final String ERROR_CODE_ENTITY = "EC10:";
	public static final String ERROR_CODE_APP = "EC11:";
	
	public static int ITEM_STATE_NONE = 0;
	public static int ITEM_STATE_CLASSIFIED = 1;
	public static int ITEM_STATE_CONFIRMED = 2;
	public static int ITEM_STATE_DISPOSED = 3;
	public static int ITEM_STATE_COLLECTED = 4;
	public static int ITEM_STATE_ARRIVED = 5;
	public static int ITEM_STATE_CHECKED = 6;
	public static int ITEM_STATE_UNEXPECTED = 7;
	
	public static final String WASTE_DISPOSAL = "waste_disposal";
	public static final String WASTE_COLLECTION = "waste_collection";
	
	public static final String BIN_REUSE = "bin_reuse";
	public static final String BIN_RECYCLE = "bin_recycle";
	public static final String BIN_VALUE = "bin_value";
	
}

