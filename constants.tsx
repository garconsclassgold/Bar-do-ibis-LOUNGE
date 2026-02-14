
import { ChecklistItem } from './types';

export const OPENING_CHECKLIST: { [key: string]: ChecklistItem[] } = {
  'Abastecimento Inicial': [
    { id: 'op_ice', label: 'Encher cooler da praia com gelo', category: 'Abastecimento' },
    { id: 'op_beer', label: 'Abastecer o cooler com cervejas e bebidas', category: 'Abastecimento' },
    { id: 'op_refill', label: 'Repor bebidas da noite passada', category: 'Abastecimento' },
    { id: 'op_stock', label: 'Conferir estoque geral de bebidas', category: 'Abastecimento' },
    { id: 'op_validity', label: 'Conferir validade das bebidas', category: 'Abastecimento' },
    { id: 'op_labels', label: 'Trocar etiquetas vencidas', category: 'Abastecimento' },
  ],
  'Limpeza e Padrão Hoteleiro': [
    { id: 'clean_floor', label: 'Lavar chão do bar', category: 'Limpeza' },
    { id: 'clean_bench', label: 'Higienizar bancada', category: 'Limpeza' },
    { id: 'clean_trash', label: 'Conferir lixeiras e retirar lixo', category: 'Limpeza' },
    { id: 'clean_drains', label: 'Conferir ralos', category: 'Limpeza' },
    { id: 'clean_visual', label: 'Verificar se a bancada acima esta com o visual profissional e aconchegante', category: 'Limpeza' },
  ],
  'Organização da Bancada': [
    { id: 'org_setup', label: 'Montar a bancada de atendimento', category: 'Organização' },
    { id: 'org_tools', label: 'Conferir utensílios (coqueteleira, dosador, colher bailarina)', category: 'Organização' },
    { id: 'org_glass_polish', label: 'Polir copos', category: 'Organização' },
    { id: 'org_glass_check', label: 'Conferir copos manchados', category: 'Organização' },
    { id: 'org_napkins', label: 'Organizar guardanapos e canudos', category: 'Organização' },
    { id: 'org_ice_machine', label: 'Conferir máquina de gelo', category: 'Organização' },
    { id: 'org_wash_machine', label: 'Conferir máquina de lavar copos', category: 'Organização' },
    { id: 'org_closet', label: 'Guardar dentro do armário do bar', category: 'Organização' },
  ],
  'Frutas e Produção': [
    { id: 'prod_fruit_stock', label: 'Conferir frutas no depósito', category: 'Produção' },
    { id: 'prod_fruit_select', label: 'Selecionar frutas adequadas', category: 'Produção' },
    { id: 'prod_fruit_cut', label: 'Cortar frutas necessárias', category: 'Produção' },
    { id: 'prod_fruit_organize', label: 'Organizar no porta-frutas', category: 'Produção' },
    { id: 'prod_coconut_check', label: 'Verificar coco disponível', category: 'Produção' },
    { id: 'prod_coconut_cut', label: 'Conferir ir ver a mediade coco cortado', category: 'Produção' },
    { id: 'prod_ginger', label: 'Preparar espuma de gengibre', category: 'Produção' },
  ],
  'Freezers e Conservação': [
    { id: 'frz_operation', label: 'Verificar funcionamento dos freezers', category: 'Conservação' },
    { id: 'frz_temp', label: 'Conferir temperatura', category: 'Conservação' },
    { id: 'frz_doors', label: 'Higienizar portas', category: 'Conservação' },
    { id: 'frz_vaseline', label: 'Aplicar vaselina na porta dos freezer', category: 'Conservação' },
    { id: 'frz_1', label: 'Freezer 1', category: 'Conservação' },
    { id: 'frz_2', label: 'Freezer 2', category: 'Conservação' },
    { id: 'frz_3', label: 'Freezer 3', category: 'Conservação' },
    { id: 'frz_4', label: '4 Freezer', category: 'Conservação' },
    { id: 'frz_picole', label: 'Freezer de picolé', category: 'Conservação' },
    { id: 'frz_polpa', label: 'Freezer das polpas de suco', category: 'Conservação' },
    { id: 'frz_coco', label: 'Freezer de coco', category: 'Conservação' },
    { id: 'frz_coca_ks', label: 'Freezer de coca ks', category: 'Conservação' },
    { id: 'frz_cervejas', label: 'Freezer de cervejas', category: 'Conservação' },
  ]
};

export const CLOSING_CHECKLIST: { [key: string]: ChecklistItem[] } = {
  'Conferência de Estoque Final': [
    { id: 'cl_low_stock', label: 'Registrar produtos com baixo estoque', category: 'Estoque' },
    { id: 'cl_validity', label: 'conferir bebidas abertas e descartar', category: 'Estoque' },
    { id: 'cl_losses', label: 'Registrar perdas ou quebras', category: 'Estoque' },
    { id: 'cl_coconut_update', label: 'conferir ir ver a mediade coco cortado', category: 'Estoque' },
    { id: 'cl_critical_open', label: 'REFORÇO: Conferir novamente se ficou bebida aberta fora do padrão (Item Crítico)', category: 'Estoque', critical: true },
  ],
  'Abastecimento Geral': [
    { id: 'abs_coca_ks', label: 'Freezer de Coca KS', category: 'Abastecimento' },
    { id: 'abs_cervejas_list', label: 'Freezer de cervejas (Corona, Heineken LN e 600ml, Stella 600ml e LN, Original 600ml)', category: 'Abastecimento' },
  ],
  'Máquina de Lavar Copos': [
    { id: 'cl_wash_check', label: 'Verificar se há copos esquecidos dentro da máquina', category: 'Maquinário' },
    { id: 'cl_wash_empty', label: 'Retirar copos limpos', category: 'Maquinário' },
    { id: 'cl_wash_filter', label: 'Esvaziar e limpar filtro da máquina', category: 'Maquinário' },
    { id: 'cl_wash_off', label: 'Desligar corretamente a máquina', category: 'Maquinário' },
  ],
  'Desmontagem e Organização': [
    { id: 'cl_store_spirits', label: 'Guardar destilados corretamente', category: 'Organização' },
    { id: 'cl_fruit_holder', label: 'colocar plastico filmes no porta frutas', category: 'Organização' },
    { id: 'cl_discard_fruit', label: 'Descartar frutas impróprias', category: 'Organização' },
    { id: 'cl_store_fruit', label: 'Armazenar frutas restantes corretamente', category: 'Organização' },
    { id: 'cl_closet', label: 'guardar dentro do armario do bar', category: 'Organização' },
  ],
  'Lavagem Completa do Bar': [
    { id: 'cl_wash_bench', label: 'Lavar bancada com detergente neutro', category: 'Limpeza' },
    { id: 'cl_wash_prep', label: 'Higienizar área de preparo', category: 'Limpeza' },
    { id: 'cl_wash_tools', label: 'Lavar coqueteleiras e dosadores', category: 'Limpeza' },
    { id: 'cl_wash_boards', label: 'Lavar tábuas de corte e passar plastico filme', category: 'Limpeza' },
    { id: 'cl_wash_floor', label: 'Lavar chão do bar', category: 'Limpeza' },
    { id: 'cl_wash_drains', label: 'Higienizar ralos', category: 'Limpeza' },
  ],
  'Fechamento Final': [
    { id: 'cl_close_freezers', label: 'Conferir freezers fechados', category: 'Finalização' },
    { id: 'cl_close_lights', label: 'luzes e equipamento eletricos', category: 'Finalização' },
    { id: 'cl_close_machines', label: 'Desligar maquina de gelo, liquidificador e maquina de gelo', category: 'Finalização' },
    { id: 'cl_vaseline_repeat', label: 'passar vaselina novamente nos materiais', category: 'Finalização' },
  ]
};
