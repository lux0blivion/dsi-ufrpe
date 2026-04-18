import * as turf from '@turf/turf';

// Importação das camadas otimizadas
import biomasData from '../assets/map_layers/biomas_aquasense.json';
import macroData from '../assets/map_layers/macro_rh_aquasense.json';
import mesoData from '../assets/map_layers/meso_rh_aquasense.json';
import microData from '../assets/map_layers/micro_rh_aquasense.json';
import municipiosData from '../assets/map_layers/municipios_pe.json';

// Definição da interface para garantir a tipagem correta no React Native
export interface GeoContexto {
  bioma: string;
  macroRH: string;
  mesoRH: string;
  microRH: string;
  municipio: string;
}

/**
 * Função utilitária genérica para buscar o nome do polígono que contém o ponto.
 * @param pt Ponto gerado pelo Turf.js
 * @param geojsonData A camada GeoJSON a ser pesquisada
 * @param chavesPropriedade Array com os possíveis nomes da coluna na tabela de atributos (ex: ['NM_MUN', 'nome'])
 */
const encontrarNomePoligono = (pt: any, geojsonData: any, chavesPropriedade: string[]): string => {
  try {
    for (const feature of geojsonData.features) {
      if (turf.booleanPointInPolygon(pt, feature)) {
        // Se o ponto estiver dentro do polígono, procura qual chave contém o nome
        for (const chave of chavesPropriedade) {
          if (feature.properties && feature.properties[chave]) {
            return String(feature.properties[chave]);
          }
        }
        return "Atributo não encontrado no JSON";
      }
    }
    return "Fora da área mapeada";
  } catch (error) {
    console.error("Erro ao processar camada geográfica:", error);
    return "Erro de processamento";
  }
};

/**
 * Retorna o contexto geográfico completo de uma coordenada consultando todas as camadas locais.
 */
export function obterContextoGeografico(latitude: number, longitude: number): GeoContexto {
  // ATENÇÃO: O Turf.js exige o formato [longitude, latitude]
  const pt = turf.point([longitude, latitude]);

  return {
    bioma: encontrarNomePoligono(pt, biomasData, ['nm_bm']),
    macroRH: encontrarNomePoligono(pt, macroData, ['nm_macroRH']),
    mesoRH: encontrarNomePoligono(pt, mesoData, ['nm_mesoRH']),
    microRH: encontrarNomePoligono(pt, microData, ['nm_microRH']),
    municipio: encontrarNomePoligono(pt, municipiosData, ['NM_MUN']),
  };
}