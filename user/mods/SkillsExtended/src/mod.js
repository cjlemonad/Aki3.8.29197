"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceManager_1 = require("./InstanceManager");
const customWeapons = __importStar(require("../config/CustomWeapons.json"));
const blankKeyMapping = __importStar(require("../config/KeyBlankMapping.json"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
var TraderIDs;
(function (TraderIDs) {
    TraderIDs["Mechanic"] = "5a7c2eca46aef81a7ca2145d";
    TraderIDs["Skier"] = "58330581ace78e27b8b10cee";
    TraderIDs["Peacekeeper"] = "5935c25fb3acc3127c3d8cd9";
    TraderIDs["Therapist"] = "54cb57776803fa99248b456e";
    TraderIDs["Prapor"] = "54cb50c76803fa8b248b4571";
    TraderIDs["Jaeger"] = "5c0647fdd443bc2504c2d371";
    TraderIDs["Ragman"] = "5ac3b934156ae10c4430e83c";
})(TraderIDs || (TraderIDs = {}));
var CurrencyIDs;
(function (CurrencyIDs) {
    CurrencyIDs["Roubles"] = "5449016a4bdc2d6f028b456f";
    CurrencyIDs["Euros"] = "569668774bdc2da2298b4568";
    CurrencyIDs["Dollars"] = "5696686a4bdc2da3298b456a";
})(CurrencyIDs || (CurrencyIDs = {}));
class SkillsPlus {
    Instance = new InstanceManager_1.InstanceManager();
    locale;
    customItemService;
    preAkiLoad(container) {
        this.Instance.preAkiLoad(container, "Skills Extended");
        this.registerRoutes();
    }
    postDBLoad(container) {
        this.Instance.postDBLoad(container);
        this.customItemService = container.resolve("CustomItemService");
        this.setLocales();
        //this.CloneKeysToBlanks();
        this.locale = this.Instance.database.locales.global;
    }
    setLocales() {
        this.Instance.database.locales.global.en.FirstAidDescription += "FirstAidDescriptionPattern";
        this.Instance.database.locales.global.en.FieldMedicineDescription = "FieldMedicineDescriptionPattern";
    }
    loadCustomWeaponsForUsecSkill() {
        return JSON.stringify(customWeapons.USEC_Rifle_Carbine_Skill);
    }
    loadCustomWeaponsForBearSkill() {
        return JSON.stringify(customWeapons.BEAR_Rifle_Carbine_Skill);
    }
    getKeys() {
        const items = this.Instance.database.templates.items;
        const keys = {
            keyLocale: {},
            keyBlankMapping: {}
        };
        for (const item in items) {
            if (items[item]._parent === "5c99f98d86f7745c314214b3" || items[item]._parent === "5c164d2286f774194c5e69fa") {
                keys.keyLocale[item] = this.locale.en[`${items[item]._id} Name`];
                this.Instance.logger.logWithColor(this.locale.en[`${items[item]._id} Name`], LogTextColor_1.LogTextColor.GREEN);
            }
        }
        keys.keyBlankMapping = blankKeyMapping;
        return JSON.stringify(keys);
    }
    registerRoutes() {
        this.Instance.staticRouter.registerStaticRouter("GetKeys", [
            {
                url: "/skillsExtended/GetKeys",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: (url, info, sessionId, output) => {
                    return this.getKeys();
                }
            }
        ], "");
        this.Instance.staticRouter.registerStaticRouter("GetCustomWeaponsUsec", [
            {
                url: "/skillsExtended/GetCustomWeaponsUsec",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: (url, info, sessionId, output) => {
                    return this.loadCustomWeaponsForUsecSkill();
                }
            }
        ], "");
        this.Instance.staticRouter.registerStaticRouter("GetCustomWeaponsBear", [
            {
                url: "/skillsExtended/GetCustomWeaponsBear",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: (url, info, sessionId, output) => {
                    return this.loadCustomWeaponsForBearSkill();
                }
            }
        ], "");
    }
    CloneKeysToBlanks() {
        this.cloneIndustrialKeyToBlank();
    }
    // Clones factory key to be used as a blank for bump lock picking
    cloneIndustrialKeyToBlank() {
        const blankKey = {
            itemTplToClone: "5448ba0b4bdc2d02308b456c",
            overrideProperties: {
                MaximumNumberOfUsage: 5,
                CanSellOnRagfair: false
            },
            parentId: "543be5e94bdc2df1348b4568",
            newId: "Industrial_Blank_Key",
            fleaPriceRoubles: 120000,
            handbookPriceRoubles: 100000,
            handbookParentId: "5b47574386f77428ca22b342",
            locales: {
                en: {
                    name: "Industrial key blank",
                    shortName: "Industrial Key blank",
                    description: "An industrial blank key used for bump picking locks"
                }
            }
        };
        this.customItemService.createItemFromClone(blankKey);
        const mechanic = this.Instance.database.traders[TraderIDs.Mechanic];
        mechanic.assort.items.push({
            _id: "Industrial_Blank_Key",
            _tpl: "Industrial_Blank_Key",
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: false,
                StackObjectsCount: 2
            }
        });
        mechanic.assort.barter_scheme.Industrial_Blank_Key = [
            [
                {
                    count: 100000,
                    _tpl: CurrencyIDs.Roubles
                }
            ]
        ];
        mechanic.assort.loyal_level_items.Industrial_Blank_Key = 2;
    }
}
module.exports = { mod: new SkillsPlus() };
//# sourceMappingURL=mod.js.map