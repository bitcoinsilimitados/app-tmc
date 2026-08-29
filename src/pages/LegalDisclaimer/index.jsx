import React from "react";
import LegalPage, {
  sectionStyle,
  h2Style,
  h3Style,
  pStyle,
  ulStyle,
  liStyle,
  strongStyle,
  warningBoxStyle,
  boxStyle,
} from "../Legal";

const LegalDisclaimer = () => (
  <LegalPage title="Aviso Legal y Desclaimer">
    <div style={sectionStyle}>
      <div style={warningBoxStyle}>
        <h2 style={h2Style}>⚠️ AVISO IMPORTANTE - LEA ATENTAMENTE</h2>
        <p style={pStyle}>
          <strong style={strongStyle}>TheMonopolyClub</strong> es una plataforma descentralizada
          basada en tecnología blockchain y contratos inteligentes. Al utilizar esta plataforma,
          usted reconoce y acepta los siguientes términos y condiciones legales.
        </p>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>1. No es Asesoramiento Financiero</h2>
      <div style={warningBoxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>LA PLATAFORMA NO PROPORCIONA ASESORAMIENTO FINIERO, DE INVERSIÓN,
          LEGAL O FISCAL.</strong> Ningún contenido de este sitio web debe interpretarse como
          recomendación de inversión, consejo financiero o promesa de rendimientos.
        </p>
        <p style={pStyle}>
          Cualquier decisión de inversión basada en la información proporcionada en la plataforma
          es tomada bajo la exclusiva responsabilidad del usuario. Se recomienda encarecidamente
          consultar con profesionales cualificados antes de tomar cualquier decisión de inversión.
        </p>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>2. No es un Producto de Inversión Registrado</h2>
      <p style={pStyle}>
        La plataforma no constituye un producto de inversión registrado ante ninguna autoridad
        reguladora financiera. No es:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Un valor mobiliario (security) registrado ante la SEC o equivalente.</li>
        <li style={liStyle}>Un fondo de inversión regulado.</li>
        <li style={liStyle}>Un producto bancario o de depósito.</li>
        <li style={liStyle}>Un contrato de futuros, opciones u otros derivados regulados.</li>
        <li style={liStyle}>Un producto de seguro.</li>
      </ul>
      <p style={pStyle}>
        La participación en la plataforma es voluntaria y el usuario reconoce que no existe
        protección regulatoria para su inversión.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>3. Riesgo de Pérdida Total</h2>
      <div style={warningBoxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>EL USUARIO RECONOCE Y ACEPTA QUE:</strong>
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>
            Las inversiones en criptoactivos y plataformas descentralizadas conllevan un
            <strong style={strongStyle}> ALTO RIESGO DE PÉRDIDA TOTAL</strong> de los fondos invertidos.
          </li>
          <li style={liStyle}>
            No existe garantía alguna de retorno de inversión o beneficios.
          </li>
          <li style={liStyle}>
            El valor de los criptoactivos puede fluctuar significativamente y el usuario
            puede perder la totalidad de su inversión.
          </li>
          <li style={liStyle}>
            Las transacciones en blockchain son irreversibles y no pueden ser canceladas ni reembolsadas.
          </li>
        </ul>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>4. Ausencia de Garantías</h2>
      <p style={pStyle}>
        La plataforma se proporciona <strong style={strongStyle}>"TAL CUAL"</strong> y{" "}
        <strong style={strongStyle}>"SEGÚN DISPONIBILIDAD"</strong>. En la máxima medida permitida
        por la ley aplicable, se excluyen todas las garantías, ya sean expresas o implícitas, incluyendo
        pero no limitándose a:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Garantías de comerciabilidad.</li>
        <li style={liStyle}>Garantías de idoneidad para un propósito particular.</li>
        <li style={liStyle}>Garantías de no infracción.</li>
        <li style={liStyle}>Garantías de disponibilidad continua o error-free.</li>
        <li style={liStyle}>Garantías de seguridad contra ataques o vulnerabilidades.</li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>5. Limitación de Responsabilidad</h2>
      <div style={warningBoxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>EN NINGÚN CASO LOS DESARROLLADORES, OPERADORES, AFILIADOS,
          DISTRIBUIDORES O CUALQUIER PARTE ASOCIADA A LA PLATAFORMA SERÁN RESPONSABLES DE:</strong>
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>
            Pérdidas directas, indirectas, incidentales, especiales, consecuentes o punitivas.
          </li>
          <li style={liStyle}>
            Pérdida de beneficios, datos, fondo de comercio u otras pérdidas intangibles.
          </li>
          <li style={liStyle}>
            Daños derivados del uso o la imposibilidad de usar la plataforma.
          </li>
          <li style={liStyle}>
            Acceso no autorizado o alteración de transmisiones o datos.
          </li>
          <li style={liStyle}>
            Errores, virus, troyanos o similares que puedan ser transmitidos a través del servicio.
          </li>
          <li style={liStyle}>
            Conducta o contenido de terceros en el servicio.
          </li>
        </ul>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>6. Cumplimiento Regulatorio y Restricciones Geográficas</h2>
      <p style={pStyle}>
        El usuario es el único responsable de determinar si su uso de la plataforma cumple con
        todas las leyes y regulaciones aplicables en su jurisdicción. La plataforma puede no
        estar disponible o puede estar restringida en ciertas jurisdicciones.
      </p>
      <div style={boxStyle}>
        <h3 style={h3Style}>Jurisdicciones Restringidas</h3>
        <p style={pStyle}>
          El uso de la plataforma está prohibido para residentes de países donde las criptoactivos
          o los sistemas de afiliados estén prohibidos o restringidos, incluyendo pero no limitándose a:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Países bajo sanciones internacionales (ej. Corea del Norte, Irán, Siria).</li>
          <li style={liStyle}>Jurisdicciones donde los criptoactivos estén prohibidos.</li>
          <li style={liStyle}>Países con regulaciones específicas que prohíban este tipo de plataformas.</li>
        </ul>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>7. Cumplimiento Fiscal</h2>
      <p style={pStyle}>
        El usuario es el único responsable de determinar qué impuestos aplican a sus transacciones
        en la plataforma. La plataforma no proporciona asesoramiento fiscal y no es responsable
        de las obligaciones fiscales del usuario. Se recomienda consultar con un asesor fiscal
        cualificado.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>8. Contratos Inteligentes y Autonomía</h2>
      <p style={pStyle}>
        Los contratos inteligentes que operan la plataforma son autónomos y se ejecutan
        automáticamente según su programación. Una vez desplegados:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>No pueden ser modificados ni detenidos por ninguna parte.</li>
        <li style={liStyle}>Operan de forma transparente y verificable en la blockchain.</li>
        <li style={liStyle}>Las transacciones son irreversibles una vez confirmadas en la blockchain.</li>
        <li style={liStyle}>No existe un punto central de control o fallo.</li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>9. Propiedad y Custodia de Fondos</h2>
      <p style={pStyle}>
        El usuario mantiene la custodia total de sus fondos en todo momento a través de su wallet
        personal. La plataforma no custodia fondos de usuarios. El usuario es responsable de:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Mantener seguras sus claves privadas y seed phrase.</li>
        <li style={liStyle}>Verificar las direcciones de contrato antes de interactuar.</li>
        <li style={liStyle}>Comprender las implicaciones de cada transacción.</li>
        <li style={liStyle}>Asumir la pérdida total si pierde el acceso a su wallet.</li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>10. Indemnización</h2>
      <p style={pStyle}>
        El usuario acepta indemnizar, defender y mantener indemne a los desarrolladores, operadores,
        colaboradores y cualquier parte asociada de y contra cualquier reclamación, responsabilidad,
        daño, pérdida, coste o gasto (incluidos honorarios razonables de abogados) derivados de:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>El uso de la plataforma por parte del usuario.</li>
        <li style={liStyle}>La violación de estos términos por parte del usuario.</li>
        <li style={liStyle}>La violación de cualquier ley o regulación aplicable.</li>
        <li style={liStyle}>La violación de derechos de terceros.</li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>11. Resolución de Disputas</h2>
      <p style={pStyle}>
        Cualquier disputa derivada del uso de la plataforma se resolverá preferiblemente mediante
        negociación de buena fe. Si no se alcanza un acuerdo, las partes se someterán a los
        tribunales competentes según la ley aplicable, renunciando a cualquier otro fuero que
        pudiera corresponderles.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>12. Divisibilidad</h2>
      <p style={pStyle}>
        Si alguna disposición de este Aviso Legal se considera inválida, ilegal o inaplicable,
        la validez, legalidad y aplicabilidad de las disposiciones restantes no se verán afectadas
        ni menoscabadas.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>13. Contacto</h2>
      <p style={pStyle}>
        Para cualquier consulta relacionada con este Aviso Legal, puede contactar a través de
        los canales oficiales de comunicación de la plataforma.
      </p>
    </div>

    <div style={sectionStyle}>
      <div style={warningBoxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>AL UTILIZAR ESTA PLATAFORMA, USTED CONFIRMA QUE HA LEÍDO,
          COMPRENDIDO Y ACEPTADO ESTE AVISO LEGAL EN SU TOTALIDAD. SI NO ESTÁ DE ACUERDO CON
          ALGUNA PARTE DE ESTE AVISO, NO UTILICE LA PLATAFORMA.</strong>
        </p>
      </div>
    </div>
  </LegalPage>
);

export default LegalDisclaimer;
