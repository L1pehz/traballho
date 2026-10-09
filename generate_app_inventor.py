#!/usr/bin/env python3
import sys
import os
sys.path.append("/home/jules/self_created_tools")
from aia_builder import build_aia

def get_screen1_scm():
    return '''#$JSON
{
  "Source": "Form",
  "Properties": {
    "$Name": "Screen1",
    "$Type": "Form",
    "$Version": "30",
    "AppName": "AssistenteSeguranca",
    "Title": "Central de Segurança - SOS",
    "BackgroundColor": "&HFFFFFFFF",
    "AlignHorizontal": "3",
    "$Components": [
      {
        "$Name": "LabelTitle",
        "$Type": "Label",
        "$Version": "5",
        "Text": "Central de Segurança Pessoal",
        "FontSize": 22,
        "FontBold": true,
        "TextColor": "&HFF0F172A"
      },
      {
        "$Name": "LabelStatus",
        "$Type": "Label",
        "$Version": "5",
        "Text": "Status: Monitoramento Ativo - Seguro",
        "FontSize": 14,
        "TextColor": "&HFF16A34A"
      },
      {
        "$Name": "ButtonSOS",
        "$Type": "Button",
        "$Version": "6",
        "Text": "🚨 EMERGÊNCIA - BOTÃO SOS",
        "FontSize": 18,
        "FontBold": true,
        "BackgroundColor": "&HFFDC2626",
        "TextColor": "&HFFFFFFFF",
        "Width": -2,
        "Height": 80
      },
      {
        "$Name": "LabelCountdown",
        "$Type": "Label",
        "$Version": "5",
        "Text": "Contagem de Segurança: 5s",
        "FontSize": 16,
        "FontBold": true,
        "TextColor": "&HFFD97706",
        "Visible": false
      },
      {
        "$Name": "ButtonCancelSOS",
        "$Type": "Button",
        "$Version": "6",
        "Text": "CANCELAR ACIONAMENTO (5s)",
        "FontSize": 16,
        "FontBold": true,
        "BackgroundColor": "&HFFEAB308",
        "TextColor": "&HFF0F172A",
        "Width": -2,
        "Height": 50,
        "Visible": false
      },
      {
        "$Name": "BtnNavLocation",
        "$Type": "Button",
        "$Version": "6",
        "Text": "📍 Localização GPS",
        "FontSize": 16,
        "BackgroundColor": "&HFF2563EB",
        "TextColor": "&HFFFFFFFF",
        "Width": -2
      },
      {
        "$Name": "BtnNavSiren",
        "$Type": "Button",
        "$Version": "6",
        "Text": "🔊 Sirene e Alertas",
        "FontSize": 16,
        "BackgroundColor": "&HFF7C3AED",
        "TextColor": "&HFFFFFFFF",
        "Width": -2
      },
      {
        "$Name": "BtnNavChecklist",
        "$Type": "Button",
        "$Version": "6",
        "Text": "📋 Checklist de Segurança",
        "FontSize": 16,
        "BackgroundColor": "&HFF0D9488",
        "TextColor": "&HFFFFFFFF",
        "Width": -2
      },
      {
        "$Name": "BtnNavHistory",
        "$Type": "Button",
        "$Version": "6",
        "Text": "📜 Histórico de Eventos",
        "FontSize": 16,
        "BackgroundColor": "&HFF475569",
        "TextColor": "&HFFFFFFFF",
        "Width": -2
      },
      {
        "$Name": "TimerSOS",
        "$Type": "Clock",
        "$Version": "4",
        "TimerInterval": 1000,
        "TimerEnabled": false
      },
      {
        "$Name": "Notifier1",
        "$Type": "Notifier",
        "$Version": "6"
      },
      {
        "$Name": "TinyDB1",
        "$Type": "TinyDB",
        "$Version": "2"
      }
    ]
  }
}'''

def get_screen1_bky():
    return '''<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="global_declaration" id="var_countdown" x="20" y="20">
    <field name="NAME">countdown</field>
    <value name="VALUE"><block type="math_number"><field name="NUM">5</field></block></value>
  </block>
  <block type="component_event" id="sos_click" x="20" y="80">
    <mutation component_type="Button" instance_name="ButtonSOS" event_name="Click"></mutation>
    <field name="COMPONENT_SELECTOR">ButtonSOS</field>
    <statement name="DO">
      <block type="lexical_variable_set">
        <field name="VAR">global countdown</field>
        <value name="VALUE"><block type="math_number"><field name="NUM">5</field></block></value>
      </block>
      <block type="component_set_get">
        <mutation component_type="Clock" set_or_get="set" property_name="TimerEnabled" is_generic="false"></mutation>
        <field name="COMPONENT_SELECTOR">TimerSOS</field>
        <field name="PROP">TimerEnabled</field>
        <value name="VALUE"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value>
      </block>
    </statement>
  </block>
</xml>'''

def get_screen_location_scm():
    return '''#$JSON
{
  "Source": "Form",
  "Properties": {
    "$Name": "ScreenLocation",
    "$Type": "Form",
    "$Version": "30",
    "AppName": "AssistenteSeguranca",
    "Title": "Localização GPS",
    "BackgroundColor": "&HFFFFFFFF",
    "$Components": [
      {
        "$Name": "LabelTitle",
        "$Type": "Label",
        "$Version": "5",
        "Text": "Localização pelo GPS",
        "FontSize": 20,
        "FontBold": true
      },
      {
        "$Name": "LabelLatitude",
        "$Type": "Label",
        "$Version": "5",
        "Text": "Latitude: Indisponível"
      },
      {
        "$Name": "LabelLongitude",
        "$Type": "Label",
        "$Version": "5",
        "Text": "Longitude: Indisponível"
      },
      {
        "$Name": "LocationSensor1",
        "$Type": "LocationSensor",
        "$Version": "3"
      },
      {
        "$Name": "ActivityStarter1",
        "$Type": "ActivityStarter",
        "$Version": "6",
        "Action": "android.intent.action.VIEW"
      }
    ]
  }
}'''

def get_screen_location_bky():
    return '<xml xmlns="https://developers.google.com/blockly/xml"></xml>'

def get_screen_siren_scm():
    return '''#$JSON
{
  "Source": "Form",
  "Properties": {
    "$Name": "ScreenSiren",
    "$Type": "Form",
    "$Version": "30",
    "AppName": "AssistenteSeguranca",
    "Title": "Sirene e Alertas",
    "BackgroundColor": "&HFFFFFFFF",
    "$Components": [
      {
        "$Name": "Sound1",
        "$Type": "Sound",
        "$Version": "3"
      },
      {
        "$Name": "Player1",
        "$Type": "Player",
        "$Version": "6",
        "Loop": true
      }
    ]
  }
}'''

def get_screen_siren_bky():
    return '<xml xmlns="https://developers.google.com/blockly/xml"></xml>'

def get_screen_checklist_scm():
    return '''#$JSON
{
  "Source": "Form",
  "Properties": {
    "$Name": "ScreenChecklist",
    "$Type": "Form",
    "$Version": "30",
    "AppName": "AssistenteSeguranca",
    "Title": "Checklist de Segurança",
    "BackgroundColor": "&HFFFFFFFF",
    "$Components": [
      {
        "$Name": "CheckBox1",
        "$Type": "CheckBox",
        "$Version": "2",
        "Text": "1. Janelas e portas trancadas"
      }
    ]
  }
}'''

def get_screen_checklist_bky():
    return '<xml xmlns="https://developers.google.com/blockly/xml"></xml>'

def get_screen_history_scm():
    return '''#$JSON
{
  "Source": "Form",
  "Properties": {
    "$Name": "ScreenHistory",
    "$Type": "Form",
    "$Version": "30",
    "AppName": "AssistenteSeguranca",
    "Title": "Histórico de Eventos",
    "BackgroundColor": "&HFFFFFFFF",
    "$Components": [
      {
        "$Name": "ListViewHistory",
        "$Type": "ListView",
        "$Version": "6"
      }
    ]
  }
}'''

def get_screen_history_bky():
    return '<xml xmlns="https://developers.google.com/blockly/xml"></xml>'

def main():
    screens_data = {
        "Screen1": {"scm": get_screen1_scm(), "bky": get_screen1_bky()},
        "ScreenLocation": {"scm": get_screen_location_scm(), "bky": get_screen_location_bky()},
        "ScreenSiren": {"scm": get_screen_siren_scm(), "bky": get_screen_siren_bky()},
        "ScreenChecklist": {"scm": get_screen_checklist_scm(), "bky": get_screen_checklist_bky()},
        "ScreenHistory": {"scm": get_screen_history_scm(), "bky": get_screen_history_bky()}
    }

    build_aia("AssistenteSeguranca.aia", "AssistenteSeguranca", "user", screens_data)

if __name__ == "__main__":
    main()
