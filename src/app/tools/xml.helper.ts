//import { Builder, Parser } from 'xml2js';
import {decode, encode} from "html-entities";

export abstract class XmlHelper {
	//protected static _builder = new Builder();
	//protected static _parser = new Parser();

	static DecodeHtml(text: unknown): string | undefined {
		if (typeof text === "undefined" || (typeof text === "string" && text === "")) {
			return undefined;
		}
		if (typeof text !== "string") {
			return XmlHelper.DecodeHtml(`${text}`);
		}
		return decode(text);
	}

	static DecodeTrackUri(input: unknown): string | undefined {
		if (typeof input !== "string" || input === "") {
			return undefined;
		}
		return XmlHelper.DecodeXml(decodeURIComponent(input));
	}

	static DecodeXml(text: unknown): string | undefined {
		if (typeof text !== "string" || text === "") {
			return undefined;
		}

		return decode(text, {level: "xml"});
	}

	static EncodeXml(xml: unknown): string {
		if (typeof xml !== "string" || xml === "") return "";
		return encode(xml, {level: "xml"});
	}

	static encodeXml(json: object) {
		return "";
		//return this._builder.buildObject(json);
	}

	static decodeXml(xml: string) {
		return {};
		//return this._parser.parseStringPromise(xml);
	}
}
