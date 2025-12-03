"use client";

/**
 * Página de Termos de Uso e Tratamento de Dados (LGPD)
 * da plataforma Calçada Cidadã.
 */

export default function TermosPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-black rounded-xl text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-6 text-sm md:text-base rounded-xl px-4 py-2 bg-black">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Termos e Condições de Uso - Calçada Cidadã</h1>
          <p className="text-xs text-gray-400">Data da Última Atualização: 18/11/2025</p>
          <p className="text-[11px] text-gray-500">
            Este documento tem caráter informativo e foi elaborado com base na legislação brasileira
            aplicável, incluindo a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            Ele não substitui a análise ou orientação de um profissional jurídico.
          </p>
        </header>

        {/* 1. Aceitação dos Termos */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">1. Aceitação dos Termos</h2>
          <p className="text-gray-200">
            Ao acessar, navegar ou usar o website <strong>Calçada Cidadã</strong>, o Usuário declara
            estar ciente, ter lido, compreendido e concordado integralmente com estes Termos de Uso e
            com as regras de tratamento de dados pessoais aqui descritas. Caso o Usuário não concorde
            com qualquer disposição, deverá interromper o uso da Plataforma.
          </p>
        </section>

        {/* 2. Objeto e Descrição dos Serviços */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">2. Objeto e Descrição dos Serviços</h2>
          <p className="text-gray-200">
            A <strong>Calçada Cidadã</strong> é uma plataforma digital de caráter cívico e educativo,
            voltada à melhoria da acessibilidade urbana. Por meio dela, cidadãos podem:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-gray-200">
            <li>
              Registrar denúncias de irregularidades em calçadas, vias públicas e elementos urbanos
              (ex.: calçadas esburacadas, buracos, desníveis, obstáculos, bueiros danificados ou
              entupidos).
            </li>
            <li>
              Sugerir melhorias e intervenções (ex.: possíveis locais para criação de praças,
              áreas verdes e adaptações de acessibilidade).
            </li>
            <li>
              Acompanhar o status de suas denúncias e utilizar ferramentas de autoavaliação da
              situação da calçada antes de registrar uma denúncia.
            </li>
          </ul>

          <h3 className="font-semibold text-sm mt-2">
            2.1. Desvinculação do Poder Público
          </h3>
          <p className="text-gray-200">
            A <strong>Calçada Cidadã</strong> atua exclusivamente como ferramenta de comunicação e
            facilitação entre cidadãos e a comunidade, podendo auxiliar na geração de informações de
            interesse público. A Plataforma <strong>não</strong> representa órgão oficial nem possui
            vínculo institucional obrigatório com Prefeituras ou outros entes públicos.
          </p>
          <p className="text-gray-200">
            A análise, aprovação, priorização, prazos de atendimento ou execução de qualquer demanda
            relacionada às irregularidades denunciadas são de inteira responsabilidade do Poder Público
            competente. A Plataforma não garante resposta, solução ou prazo de atendimento por parte
            da Administração Pública.
          </p>
        </section>

        {/* 3. Cadastro e Conta de Usuário */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">3. Cadastro e Conta de Usuário</h2>

          <h3 className="font-semibold text-sm">3.1. Elegibilidade</h3>
          <p className="text-gray-200">
            O uso dos serviços que exigem cadastro é restrito a indivíduos com pelo menos 18 (dezoito)
            anos de idade ou legalmente emancipados, com plena capacidade civil, ou a menores que
            estejam formalmente representados ou assistidos por seus responsáveis legais.
          </p>

          <h3 className="font-semibold text-sm">3.2. Informações de Cadastro</h3>
          <p className="text-gray-200">
            O Usuário se compromete a fornecer informações verdadeiras, precisas, completas e
            atualizadas ao se cadastrar, incluindo, mas não se limitando a, nome, e-mail e telefone.
            O tratamento desses dados observa os princípios da{" "}
            <strong>Adequação</strong> e <strong>Necessidade</strong>, nos termos do Art. 6º, incisos
            II e III da LGPD, sendo coletados apenas dados estritamente necessários para a prestação
            dos serviços.
          </p>

          <h3 className="font-semibold text-sm">3.3. Segurança da Conta</h3>
          <p className="text-gray-200">
            O Usuário é o único e exclusivo responsável pela guarda, sigilo e uso de suas credenciais
            de acesso (e-mail e senha), comprometendo-se a não compartilhá-las com terceiros. O Usuário
            deverá notificar imediatamente a <strong>Calçada Cidadã</strong> em caso de uso não
            autorizado de sua conta ou qualquer violação de segurança de que tenha conhecimento.
          </p>
        </section>

        {/* 4. Propriedade Intelectual */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">4. Direitos de Propriedade Intelectual</h2>

          <h3 className="font-semibold text-sm">4.1. Conteúdo da Plataforma</h3>
          <p className="text-gray-200">
            Todo o conteúdo disponibilizado na <strong>Calçada Cidadã</strong>, incluindo, mas não
            se limitando a, textos, imagens, logotipos, layouts, ícones, elementos de interface,
            ilustrações, vídeos e código-fonte, é de propriedade exclusiva do{" "}
            <strong>Projeto Calçada Cidadã</strong> ou foi licenciado a ele, sendo protegido pela
            legislação de direitos autorais, propriedade industrial e demais normas aplicáveis.
          </p>

          <h3 className="font-semibold text-sm">4.2. Uso do Conteúdo</h3>
          <p className="text-gray-200">
            É estritamente proibida a cópia, reprodução, distribuição, modificação, tradução,
            comercialização, engenharia reversa ou qualquer outra forma de exploração, total ou
            parcial, do conteúdo da Plataforma, sem autorização prévia e por escrito do{" "}
            <strong>Projeto Calçada Cidadã</strong>, ressalvadas as hipóteses autorizadas pela
            legislação brasileira.
          </p>

          <h3 className="font-semibold text-sm">4.3. Conteúdo do Usuário</h3>
          <p className="text-gray-200">
            Ao enviar ou publicar qualquer conteúdo na Plataforma (incluindo fotos, vídeos, textos,
            comentários ou avaliações), o Usuário concede à <strong>Calçada Cidadã</strong> uma
            licença não exclusiva, gratuita, global e por prazo indeterminado para usar, reproduzir,
            armazenar e exibir tal conteúdo, exclusivamente para os fins relacionados à prestação
            dos serviços, divulgação da iniciativa e produção de estatísticas ou relatórios
            agregados.
          </p>

          <h3 className="font-semibold text-sm">4.4. Garantia de Direitos e de Imagem</h3>
          <p className="text-gray-200">
            O Usuário declara e garante ser o titular de todos os direitos sobre o conteúdo que
            enviar (incluindo direitos autorais e de imagem) e que o material não viola direitos de
            terceiros, como direitos de personalidade, privacidade ou propriedade intelectual.
            O Usuário assume inteira responsabilidade por quaisquer danos, reclamações ou custos
            decorrentes de ações de terceiros relacionadas ao conteúdo por ele enviado.
          </p>
        </section>

        {/* 5. Conduta Proibida */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Conduta Proibida</h2>
          <p className="text-gray-200">
            O Usuário se compromete a utilizar a Plataforma de forma ética, responsável e em
            conformidade com a legislação brasileira, sendo vedado, entre outros:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-gray-200">
            <li>
              Transmitir ou divulgar conteúdo ilegal, difamatório, ofensivo, discriminatório,
              ameaçador, obsceno ou que incite violência ou qualquer forma de preconceito.
            </li>
            <li>
              Violar direitos de terceiros, incluindo direitos de propriedade intelectual, de
              privacidade ou de imagem.
            </li>
            <li>
              Utilizar a Plataforma para fins ilícitos ou em desacordo com a legislação brasileira.
            </li>
            <li>
              Inserir, distribuir ou tentar utilizar vírus, malware, spyware ou qualquer código
              malicioso que possa comprometer a segurança da Plataforma ou de seus Usuários.
            </li>
          </ul>
        </section>

        {/* 6. Exclusão de Garantias e Limitação de Responsabilidade */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">
            6. Exclusão de Garantias e Limitação de Responsabilidade
          </h2>

          <h3 className="font-semibold text-sm">6.1. Disponibilidade dos Serviços</h3>
          <p className="text-gray-200">
            A <strong>Calçada Cidadã</strong> envida esforços razoáveis para manter a Plataforma
            disponível e em pleno funcionamento, mas não garante que o serviço será ininterrupto,
            livre de falhas ou erros. Interrupções podem ocorrer por motivos técnicos, manutenção,
            atualizações ou eventos de força maior.
          </p>

          <h3 className="font-semibold text-sm">6.2. Limitação de Responsabilidade</h3>
          <p className="text-gray-200">
            A <strong>Calçada Cidadã</strong> não se responsabiliza por danos diretos, indiretos,
            incidentais, especiais ou consequenciais decorrentes do uso ou da impossibilidade de uso
            da Plataforma, incluindo falhas de conexão, indisponibilidade de provedores de internet,
            atos de terceiros, uso inadequado da aplicação ou informações incorretas inseridas pelos
            próprios Usuários.
          </p>

          <h3 className="font-semibold text-sm">6.3. Dever de Indenização</h3>
          <p className="text-gray-200">
            O Usuário concorda em defender, indenizar e isentar o <strong>Projeto Calçada Cidadã</strong>,
            seus colaboradores e parceiros de quaisquer reclamações, responsabilidades, custos,
            despesas ou danos resultantes do uso indevido da Plataforma, da violação destes Termos de
            Uso ou da inobservância das declarações e garantias aqui prestadas.
          </p>
        </section>

        {/* 7. Rescisão */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">7. Rescisão</h2>
          <p className="text-gray-200">
            A <strong>Calçada Cidadã</strong> poderá, a seu exclusivo critério, suspender ou encerrar
            o acesso do Usuário à Plataforma, com ou sem aviso prévio, em caso de violação destes
            Termos de Uso, de conduta proibida ou de qualquer afronta à legislação brasileira
            aplicável.
          </p>
        </section>

        {/* 8. Lei Aplicável e Foro */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">8. Lei Aplicável e Foro</h2>
          <p className="text-gray-200">
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, incluindo a
            Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018). Fica eleito o foro da Comarca
            de São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes Termos, com
            renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

        {/* 9. Tratamento de Dados Pessoais (LGPD) */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">9. Tratamento de Dados Pessoais</h2>

          <h3 className="font-semibold text-sm">9.1. Dados Coletados</h3>
          <p className="text-gray-200">
            Para a plena utilização dos serviços descritos na Seção 2, a Plataforma poderá coletar
            e tratar os seguintes dados, a depender das funcionalidades utilizadas:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-gray-200">
            <li>Dados de cadastro: nome, e-mail, telefone e credenciais de acesso.</li>
            <li>
              Dados de denúncia: endereço da ocorrência, descrição, categoria do problema,
              fotos/imagens enviadas e, se informado, vinculação à conta do Usuário.
            </li>
            <li>
              Dados de acesso: informações técnicas do dispositivo, navegador, data e hora de acesso
              (logs) para fins de segurança e estatística.
            </li>
          </ul>

          <h3 className="font-semibold text-sm">
            9.2. Acesso à Câmera e à Galeria do Dispositivo
          </h3>
          <p className="text-gray-200">
            Para permitir o envio de fotos ou vídeos relacionados às irregularidades, a plataforma{" "}
            <strong>Calçada Cidadã</strong> poderá solicitar permissão para acessar:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-gray-200">
            <li>
              <strong>Câmera do dispositivo</strong>: para captura de imagens ou vídeos em tempo real.
            </li>
            <li>
              <strong>Galeria/álbum de fotos</strong>: para anexar mídias previamente salvas pelo Usuário.
            </li>
          </ul>

          <h3 className="font-semibold text-sm">
            9.3. Finalidade e Base Legal do Tratamento
          </h3>
          <p className="text-gray-200">
            As imagens, vídeos e metadados eventualmente coletados (como localização, se habilitada)
            têm como finalidade exclusiva a prestação e o aprimoramento dos serviços da Plataforma,
            incluindo o registro de denúncias, geração de relatórios e apoio à conscientização sobre
            acessibilidade urbana.
          </p>
          <p className="text-gray-200">
            O tratamento desses dados se fundamenta, em especial, no Art. 7º, inciso V, da LGPD
            (execução de contrato ou de procedimentos preliminares relacionados a contrato do qual o
            titular seja parte) e, quando aplicável, no consentimento do titular (Art. 7º, inciso I).
          </p>

          <h3 className="font-semibold text-sm">
            9.4. Consentimento, Revogação e Configurações de Dispositivo
          </h3>
          <p className="text-gray-200">
            O acesso à câmera e à galeria é solicitado pelo navegador ou dispositivo mediante
            autorização expressa do Usuário. Esse consentimento é livre, informado e inequívoco, e
            pode ser revogado a qualquer momento pelo próprio Usuário nas configurações do navegador
            ou sistema operacional, o que poderá limitar ou impedir determinadas funcionalidades
            (como o envio de fotos na denúncia).
          </p>

          <h3 className="font-semibold text-sm">
            9.5. Uso e Responsabilidade pelas Imagens
          </h3>
          <p className="text-gray-200">
            As imagens e vídeos enviados serão utilizados apenas para fins cívicos, educativos e de
            interesse público relacionados à melhoria da acessibilidade e da infraestrutura urbana.
            O Usuário é o único responsável pelo conteúdo que envia, devendo garantir que possui os
            direitos e autorizações necessários, incluindo a autorização de pessoas que eventualmente
            apareçam nas imagens, sempre que exigido pela legislação.
          </p>
        </section>

        {/* 10. Modificações dos Termos */}
        <section className="space-y-2 pb-4">
          <h2 className="text-lg font-semibold">10. Modificações destes Termos</h2>
          <h3 className="font-semibold text-sm">10.1. Alterações</h3>
          <p className="text-gray-200">
            A <strong>Calçada Cidadã</strong> reserva-se o direito de modificar, atualizar ou
            complementar estes Termos de Uso a qualquer momento, para refletir mudanças na legislação,
            na tecnologia, nos serviços oferecidos ou por razões de segurança.
          </p>

          <h3 className="font-semibold text-sm">10.2. Notificação</h3>
          <p className="text-gray-200">
            Sempre que houver alterações relevantes, a Plataforma poderá informar o Usuário por meio
            de avisos no próprio site ou por outros canais de comunicação. O uso continuado da
            Plataforma após a publicação das alterações será interpretado como aceitação tácita dos
            novos Termos.
          </p>
        </section>
      </div>
    </main>
  );
}
