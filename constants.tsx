
import { ChecklistItem } from './types';

export const OPENING_CHECKLIST: { [key: string]: ChecklistItem[] } = {
  'Abastecimento Inicial': [
    { id: 'op_ice', label: 'Encher o cooler interno do bar com gelo', category: 'Abastecimento' },
    { id: 'op_beer', label: 'Abastecer o cooler interno com cervejas', category: 'Abastecimento' },
    { id: 'op_refill', label: 'Repor bebidas de maior saída', category: 'Abastecimento' },
    { id: 'op_stock', label: 'Conferir estoque geral de bebidas', category: 'Abastecimento' },
    { id: 'op_spirits', label: 'Verificar níveis de destilados', category: 'Abastecimento' },
    { id: 'op_validity', label: 'Conferir validade das bebidas', category: 'Abastecimento' },
    { id: 'op_labels', label: 'Trocar etiquetas vencidas', category: 'Abastecimento' },
  ],
  'Limpeza e Padrão Hoteleiro': [
    { id: 'clean_floor', label: 'Lavar chão do bar', category: 'Limpeza' },
    { id: 'clean_bench', label: 'Higienizar bancada', category: 'Limpeza' },
    { id: 'clean_trash', label: 'Conferir lixeiras e retirar lixo', category: 'Limpeza' },
    { id: 'clean_drains', label: 'Conferir ralos', category: 'Limpeza' },
    { id: 'clean_visual', label: 'Garantir padrão visual adequado', category: 'Limpeza' },
  ],
  'Organização da Bancada': [
    { id: 'org_setup', label: 'Montar a bancada de atendimento', category: 'Organização' },
    { id: 'org_spirits', label: 'Organizar destilados por categoria', category: 'Organização' },
    { id: 'org_tools', label: 'Conferir utensílios (coqueteleira, dosador, colher bailarina)', category: 'Organização' },
    { id: 'org_glass_polish', label: 'Polir copos', category: 'Organização' },
    { id: 'org_glass_check', label: 'Conferir copos manchados', category: 'Organização' },
    { id: 'org_napkins', label: 'Organizar guardanapos e canudos', category: 'Organização' },
    { id: 'org_ice_machine', label: 'Conferir máquina de gelo', category: 'Organização' },
    { id: 'org_wash_machine', label: 'Conferir máquina de lavar copos', category: 'Organização' },
  ],
  'Frutas e Produção': [
    { id: 'prod_fruit_stock', label: 'Conferir frutas no depósito', category: 'Produção' },
    { id: 'prod_fruit_select', label: 'Selecionar frutas adequadas', category: 'Produção' },
    { id: 'prod_fruit_cut', label: 'Cortar frutas necessárias', category: 'Produção' },
    { id: 'prod_fruit_organize', label: 'Organizar no porta-frutas', category: 'Produção' },
    { id: 'prod_coconut_check', label: 'Verificar coco disponível', category: 'Produção' },
    { id: 'prod_coconut_cut', label: 'Cortar cocos necessários', category: 'Produção' },
    { id: 'prod_ginger', label: 'Preparar espuma de gengibre', category: 'Produção' },
    { id: 'prod_storage', label: 'Armazenar corretamente', category: 'Produção' },
  ],
  'Freezers e Conservação': [
    { id: 'frz_operation', label: 'Verificar funcionamento dos freezers', category: 'Conservação' },
    { id: 'frz_temp', label: 'Conferir temperatura', category: 'Conservação' },
    { id: 'frz_doors', label: 'Higienizar portas', category: 'Conservação' },
    { id: 'frz_vaseline', label: 'Aplicar vaselina nas borrachas de vedação', category: 'Conservação' },
    { id: 'frz_org', label: 'Conferir organização interna', category: 'Conservação' },
  ]
};

export const CLOSING_CHECKLIST: { [key: string]: ChecklistItem[] } = {
  'Conferência de Estoque Final': [
    { id: 'cl_spirit_lvl', label: 'Conferir nível final de destilados', category: 'Estoque' },
    { id: 'cl_cooler_lvl', label: 'Conferir bebidas no cooler interno', category: 'Estoque' },
    { id: 'cl_low_stock', label: 'Registrar produtos com baixo estoque', category: 'Estoque' },
    { id: 'cl_validity', label: 'Conferir validade de itens abertos', category: 'Estoque' },
    { id: 'cl_losses', label: 'Registrar perdas ou quebras', category: 'Estoque' },
    { id: 'cl_coconut_update', label: 'Atualizar controle de cocos cortados', category: 'Estoque' },
    { id: 'cl_critical_open', label: 'Verificar se ficou alguma bebida aberta fora do padrão (Item Crítico)', category: 'Estoque', critical: true },
  ],
  'Máquina de Lavar Copos': [
    { id: 'cl_wash_check', label: 'Verificar se há copos esquecidos dentro da máquina', category: 'Maquinário' },
    { id: 'cl_wash_empty', label: 'Retirar copos limpos', category: 'Maquinário' },
    { id: 'cl_wash_filter', label: 'Esvaziar e limpar filtro da máquina', category: 'Maquinário' },
    { id: 'cl_wash_off', label: 'Desligar corretamente a máquina', category: 'Maquinário' },
  ],
  'Desmontagem e Organização': [
    { id: 'cl_store_spirits', label: 'Guardar destilados corretamente', category: 'Organização' },
    { id: 'cl_fruit_holder', label: 'Esvaziar e organizar porta-frutas', category: 'Organização' },
    { id: 'cl_discard_fruit', label: 'Descartar frutas impróprias', category: 'Organização' },
    { id: 'cl_store_fruit', label: 'Armazenar frutas restantes corretamente', category: 'Organização' },
    { id: 'cl_store_tools', label: 'Guardar utensílios limpos', category: 'Organização' },
    { id: 'cl_org_bench', label: 'Organizar bancada', category: 'Organização' },
  ],
  'Lavagem Completa do Bar': [
    { id: 'cl_wash_bench', label: 'Lavar bancada com detergente neutro', category: 'Limpeza' },
    { id: 'cl_wash_prep', label: 'Higienizar área de preparo', category: 'Limpeza' },
    { id: 'cl_wash_tools', label: 'Lavar coqueteleiras e dosadores', category: 'Limpeza' },
    { id: 'cl_wash_boards', label: 'Lavar tábuas de corte', category: 'Limpeza' },
    { id: 'cl_wash_floor', label: 'Lavar chão do bar', category: 'Limpeza' },
    { id: 'cl_wash_drains', label: 'Higienizar ralos', category: 'Limpeza' },
    { id: 'cl_wash_ice_ext', label: 'Limpar parte externa da máquina de gelo', category: 'Limpeza' },
  ],
  'Fechamento Final': [
    { id: 'cl_close_cooler', label: 'Conferir cooler interno fechado', category: 'Finalização' },
    { id: 'cl_close_freezers', label: 'Conferir freezers fechados', category: 'Finalização' },
    { id: 'cl_close_lights', label: 'Conferir luzes', category: 'Finalização' },
  ]
};
