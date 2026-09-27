# Reference database for the hyperlexia review.
# cat: core = Europe PMC record with "hyperlexia" in title/abstract
#      targeted = related literature from targeted searches
#      web = clinical / educational grey literature
#      background = foundational framework papers
# design: case, group, review, meta, acquired, animal, web, theory
# abs: False when only the bibliographic record was available

R = []


def ref(key, year, cite, cat, design, n, summary, abs=True):
    R.append(dict(key=key, year=year, cite=cite, cat=cat, design=design,
                  n=n, summary=summary, abs=abs))


# ---------------------------------------------------------------- core 1967-1999
ref('silberberg1967', 1967, 'Silberberg NE, Silberberg MC. Hyperlexia: specific word recognition skills in young children. <i>Exceptional Children</i>. 1967. doi:10.1177/001440296703400106',
    'core', 'theory', '—', 'First scientific description; coined the term for precocious, specific word-recognition skill in young children.', abs=False)
ref('niensted1968', 1968, 'Niensted SM. Hyperlexia: an educational disease? <i>Exceptional Children</i>. 1968. doi:10.1177/001440296803500210',
    'core', 'theory', '—', 'Early commentary questioning whether hyperlexia is an educational problem ("disease") or a talent.', abs=False)
ref('mehegan1972', 1972, 'Mehegan CC, Dreifuss FE. Hyperlexia. Exceptional reading ability in brain-damaged children. <i>Neurology</i>. 1972. doi:10.1212/wnl.22.11.1105',
    'core', 'case', 'series', 'Framed hyperlexia as exceptional reading in children with brain damage/developmental delay.', abs=False)
ref('huttenlocher1973', 1973, 'Huttenlocher PR, Huttenlocher J. A study of children with hyperlexia. <i>Neurology</i>. 1973. doi:10.1212/wnl.23.10.1107',
    'core', 'case', 'series', 'Early neurological case series of children with hyperlexia.', abs=False)
ref('elliott1976', 1976, 'Elliott DE, Needleman RM. The syndrome of hyperlexia. <i>Brain Lang</i>. 1976. doi:10.1016/0093-934x(76)90030-4',
    'core', 'theory', '—', 'Proposed hyperlexia as a distinct syndrome.', abs=False)
ref('richman1981', 1981, 'Richman LC, Kitchell MM. Hyperlexia as a variant of developmental language disorder. <i>Brain Lang</i>. 1981. doi:10.1016/0093-934x(81)90014-6',
    'core', 'group', '—', 'Positioned hyperlexia within developmental language disorder rather than reading disorder.', abs=False)
ref('cobrinik1982', 1982, 'Cobrinik L. The performance of hyperlexic children on an "incomplete words" task. <i>Neuropsychologia</i>. 1982. doi:10.1016/0028-3932(82)90030-6',
    'core', 'group', 'HPL vs controls', 'Hyperlexic children outperformed controls at deciphering words with deleted letter cues: faster, finer-grained, reliant on the whole visual array; linked to right-hemisphere visual processing.')
ref('fontenelle1982', 1982, 'Fontenelle S, Alarcon M. Hyperlexia: precocious word recognition in developmentally delayed children. <i>Percept Mot Skills</i>. 1982. doi:10.2466/pms.1982.55.1.247',
    'core', 'case', '7', 'Seven developmentally delayed children with precocious word recognition; discussed how the pattern may disrupt acquisition of communicative modalities.')
ref('healy1982', 1982, 'Healy JM, Aram DM, Horwitz SJ, Kessler JW. A study of hyperlexia. <i>Brain Lang</i>. 1982. doi:10.1016/0093-934x(82)90001-3',
    'core', 'group', '—', 'Influential group study characterising hyperlexic children (bibliographic record only).', abs=False)
ref('graziani1983', 1983, 'Graziani LJ, Brodsky K, Mason JC, Zager RP. Variability in IQ scores and prognosis of children with hyperlexia. <i>J Am Acad Child Psychiatry</i>. 1983. doi:10.1016/s0002-7138(09)61505-3',
    'core', 'group', '—', 'Reported wide IQ variability and its prognostic meaning in hyperlexia.', abs=False)
ref('whitehouse1984', 1984, 'Whitehouse D, Harris JC. Hyperlexia in infantile autism. <i>J Autism Dev Disord</i>. 1984. doi:10.1007/bf02409579',
    'core', 'group', '20', 'Twenty hyperlexic autistic boys followed 7–17 years: compulsion to decode without comprehension; IQ from severe disability to very superior; unusually good visual and auditory memory; large stored written vocabulary.')
ref('goldberg1984', 1984, 'Goldberg TE, Rothermel RD. Hyperlexic children reading. <i>Brain</i>. 1984. doi:10.1093/brain/107.3.759',
    'core', 'case', '8', 'Eight hyperlexic children read at grade 4–6 level; used both visual-orthographic (preferred) and phonological routes; understood single words and sentences but not paragraphs; only 3/8 showed metalinguistic awareness.')
ref('siegel1984', 1984, 'Siegel LS. A longitudinal study of a hyperlexic child: hyperlexia as a language disorder. <i>Neuropsychologia</i>. 1984. doi:10.1016/0028-3932(84)90022-8',
    'core', 'case', '1', 'Girl with WISC-R IQ 58 but advanced reading; read sentences she did not understand; argued reading can proceed via visual/phonological routes without semantic or syntactic processing.')
ref('burd1985a', 1985, 'Burd L, Kerbeshian J. Hyperlexia and a variant of hypergraphia. <i>Percept Mot Skills</i>. 1985. doi:10.2466/pms.1985.60.3.940',
    'core', 'case', '1', 'Co-occurrence of hyperlexia and hypergraphia (compulsive writing); hyperlexia proposed as a marker to guide educational programming.')
ref('burd1985b', 1985, 'Burd L, Kerbeshian J, Fisher W. Inquiry into the incidence of hyperlexia in a statewide population of children with pervasive developmental disorder. <i>Psychol Rep</i>. 1985. doi:10.2466/pr0.1985.57.1.236',
    'core', 'group', 'statewide', 'Statewide (North Dakota) estimate of hyperlexia among children with PDD (bibliographic record only).', abs=False)
ref('snowling1986', 1986, 'Snowling M, Frith U. Comprehension in "hyperlexic" readers. <i>J Exp Child Psychol</i>. 1986. doi:10.1016/0022-0965(86)90033-0',
    'core', 'group', '4 expts', 'More verbally able advanced decoders comprehended normally; low-verbal readers read word-by-word, did not use general knowledge. Proposed that impaired large-unit meaning marks "true" hyperlexia; no autistic vs non-autistic differences, so not autism-specific.')
ref('healy1986', 1986, 'Healy JM, Aram DM. Hyperlexia and dyslexia: a family study. <i>Ann Dyslexia</i>. 1986. doi:10.1007/bf02648032',
    'core', 'group', '12 families', 'Family histories of 12 hyperlexic children: familial tendency to language, reading, writing and spelling disorders in male relatives; unusually high non-left-handedness.')
ref('cossu1986', 1986, 'Cossu G, Marshall JC. Theoretical implications of the hyperlexia syndrome: two new Italian cases. <i>Cortex</i>. 1986. doi:10.1016/s0010-9452(86)80017-x',
    'core', 'case', '2', 'Two Italian girls (12.5 and 18.6 y) with severe intellectual disability read words, non-words and texts accurately; reading/writing as transcoding can develop independently of other cognitive systems.')
ref('welsh1987', 1987, 'Welsh MC, Pennington BF, Rogers S. Word recognition and comprehension skills in hyperlexic children. <i>Brain Lang</i>. 1987. doi:10.1016/0093-934x(87)90118-0',
    'core', 'case', '5', 'Five boys: reading precocious relative to IQ, but comprehension not unexpectedly deficient; phonological route preferred; pattern resembled surface dyslexia.')
ref('cohen1987', 1987, 'Cohen M, Campbell R, Gelardo M. Hyperlexia: a variant of aphasia or dyslexia. <i>Pediatr Neurol</i>. 1987. doi:10.1016/0887-8994(87)90049-x',
    'core', 'case', '5', 'Five clinic patients: the primary deficit is comprehension of spoken and written language, i.e., a language disorder rather than dyslexia.')
ref('burd1987', 1987, 'Burd L, Fisher W, Knowlton D, Kerbeshian J. Hyperlexia: a marker for improvement in children with pervasive developmental disorder? <i>J Am Acad Child Adolesc Psychiatry</i>. 1987. doi:10.1097/00004583-198705000-00022',
    'core', 'group', '—', 'Raised hyperlexia as a possible positive prognostic marker in PDD (bibliographic record only).', abs=False)
ref('goldberg1987', 1987, 'Goldberg TE. On hermetic reading abilities. <i>J Autism Dev Disord</i>. 1987. doi:10.1007/bf01487258',
    'core', 'review', '—', 'Review: hyperlexic readers use phonological and orthographic routes and derive meaning mainly from single words; savant theory of impaired procedural but intact declarative memory.')
ref('pennington1987', 1987, 'Pennington BF, Johnson C, Welsh MC. Unexpected reading precocity in a normal preschooler: implications for hyperlexia. <i>Brain Lang</i>. 1987. doi:10.1016/0093-934x(87)90035-6',
    'core', 'case', '1', 'Typically developing boy with reading age 9.3 at 2;11 and 11.2 at 4;2, with comprehension above age level: precocious reading does not require pathology (cf. Treffert Type 1).')
ref('kistner1988', 1988, 'Kistner J, Robbins F, Haskett M. Assessment and skill remediation of hyperlexic children. <i>J Autism Dev Disord</i>. 1988. doi:10.1007/bf02211946',
    'core', 'group', '2 studies', 'Hyperlexic children retain sound/symbol associations unusually well (not just exposure). Written prompts rapidly increased appropriate verbal responses in natural settings, with maintenance and generalisation.')
ref('smith1988', 1988, 'Smith IM, Bryson SE. Monozygotic twins concordant for autism and hyperlexia. <i>Dev Med Child Neurol</i>. 1988. doi:10.1111/j.1469-8749.1988.tb04780.x',
    'core', 'case', '2', 'Identical twins concordant for autism and hyperlexia but differing in profile; highlights the autism–hyperlexia relationship.')
ref('burd1988', 1988, 'Burd L, Kerbeshian J. Familial pervasive development disorder, Tourette disorder and hyperlexia. <i>Neurosci Biobehav Rev</i>. 1988. doi:10.1016/s0149-7634(88)80049-6',
    'core', 'case', '5', 'Five people in North Dakota with PDD + Tourette + hyperlexia; chance co-occurrence probability computed at 3.39 × 10<sup>−12</sup>, suggesting genetic linkage.')
ref('ichiba1988', 1988, 'Ichiba N. A neuropsychological and electroencephalographic study on atypical pervasive developmental disorder: a benign hyperlexia [in Japanese]. <i>No To Hattatsu</i>. 1988.',
    'core', 'case', '—', 'Japanese neuropsychological/EEG study proposing a "benign hyperlexia" form (bibliographic record only).', abs=False)
ref('fisher1988', 1988, 'Fisher W, Burd L, Kerbeshian J. Markers for improvement in children with pervasive developmental disorders. <i>J Ment Defic Res</i>. 1988. doi:10.1111/j.1365-2788.1988.tb01426.x',
    'core', 'group', '59', 'Across North Dakota\'s 59 children with PDD, hyperlexia was one of four predictors (with known aetiology, Tourette, age) of higher IQ and receptive/expressive language.')
ref('burd1989', 1989, 'Burd L, Kerbeshian J. Hyperlexia in Prader-Willi syndrome. <i>Lancet</i>. 1989. doi:10.1016/s0140-6736(89)90993-8',
    'core', 'case', '—', 'Reported hyperlexia in Prader-Willi syndrome (bibliographic record only).', abs=False)
ref('lachal1989', 1989, 'Lachal C. Psychopathology in early and compulsive reading [in French]. <i>Psychiatr Enfant</i>. 1989.',
    'core', 'theory', '—', 'French clinical analysis of hyperlexia as autism coupled with a compulsion to read or write and difficulty with self-expression.')
ref('ichiba1990', 1990, 'Ichiba N. West syndrome associated with hyperlexia. <i>Pediatr Neurol</i>. 1990. doi:10.1016/0887-8994(90)90029-z',
    'core', 'case', '2', 'Two children with West syndrome read Japanese and Chinese characters, numbers, Roman letters and trademarks at 3 y; fluent intonation but impaired comprehension; excellent auditory memory.')
ref('shields1991', 1991, 'Shields J. Semantic-pragmatic disorder: a right hemisphere syndrome? <i>Br J Disord Commun</i>. 1991. doi:10.3109/13682829109012023',
    'core', 'theory', '—', 'Hyperlexia in semantic-pragmatic disorder reflects difficulty integrating semantic information with world knowledge; poor inferential meaning, metaphor and humour.')
ref('bindschaedler1992', 1992, 'Bindschaedler C, Assal G. Environmental dependence in brain lesions: imitative behavior, prehension and utilization [in French]. <i>Schweiz Arch Neurol Psychiatr</i>. 1992.',
    'core', 'acquired', 'review', 'Adult neurology review placing acquired hyperlexia among environment-driven behaviours (utilisation, echolalia, hypergraphia).')
ref('tirosh1993', 1993, 'Tirosh E, Canby J. Autism with hyperlexia: a distinct syndrome? <i>Am J Ment Retard</i>. 1993.',
    'core', 'group', '5 + 5', 'Hyperlexic autistic children showed more persistent echolalia, superior visual-motor performance; 2 had macrocephaly. Conclusion: part of the autism continuum, not a separate syndrome.')
ref('patti1993', 1993, 'Patti PJ, Lupinetti L. Brief report: implications of hyperlexia in an autistic savant. <i>J Autism Dev Disord</i>. 1993. doi:10.1007/bf01046228',
    'core', 'case', '1', 'Hyperlexia described as a savant skill in an autistic individual (bibliographic record only).', abs=False)
ref('temple1996', 1996, 'Temple CM, Carney R. Reading skills in children with Turner\'s syndrome: an analysis of hyperlexia. <i>Cortex</i>. 1996. doi:10.1016/s0010-9452(96)80055-4',
    'core', 'group', 'TS vs controls', 'Girls with Turner syndrome read above age/IQ expectations with <b>good</b> comprehension and strength in both lexical and phonological routes: hyperlexia need not imply poor comprehension.')
ref('cohen1997', 1997, 'Cohen MJ, Hall J, Riccio CA. Neuropsychological profiles of children diagnosed as specific language impaired with and without hyperlexia. <i>Arch Clin Neuropsychol</i>. 1997. doi:10.1093/arclin/12.3.223',
    'core', 'group', '46 + 16', 'SLI+hyperlexia vs SLI: the essential feature is language impairment; better visual/spatial memory drives word recognition and spelling; verbal memory falls as semantic load rises.')
ref('glosser1997', 1997, 'Glosser G, Grugan P, Friedman RB. Semantic memory impairment does not impact on phonological and orthographic processing in a case of developmental hyperlexia. <i>Brain Lang</i>. 1997. doi:10.1006/brln.1997.1801',
    'core', 'case', '1', 'Orthographic and phonological whole-word representations can be acquired and retrieved without a functional link to semantic memory.')
ref('vuilleumier1997', 1997, 'Vuilleumier P, Staub F, Assal G. Sniffing behaviour, or recognizing a lily by smell, but not recognizing a sock on sight. <i>Cortex</i>. 1997. doi:10.1016/s0010-9452(08)70238-7',
    'core', 'acquired', '1', 'Adult post-anoxic encephalopathy with compulsive environment-driven behaviours including hyperlexia.')
ref('nation1999', 1999, 'Nation K. Reading skills in hyperlexia: a developmental perspective. <i>Psychol Bull</i>. 1999. doi:10.1037/0033-2909.125.3.338',
    'core', 'review', '—', 'Hyperlexia as part of normal variation in reading, explained by individual differences in phonological, orthographic and semantic processing, memory and print exposure; compulsive preoccupation may be crucial; connectionist framework.')
# ---------------------------------------------------------------- core 2000-2025
ref('sparks2000', 2000, 'Sparks RL, Artzer M. Foreign language learning, hyperlexia, and early word recognition. <i>Ann Dyslexia</i>. 2000. doi:10.1007/s11881-000-0022-6',
    'core', 'case', '3', 'Hyperlexic student followed into high school Spanish: stronger on pronunciation, word recognition and spelling than on listening, speaking, writing; FL decoding may be modular.')
ref('suzuki2000', 2000, 'Suzuki K, Yamadori A, Kumabe T, et al. Hyperlexia in an adult patient with lesions in the left medial frontal lobe [in Japanese]. <i>Rinsho Shinkeigaku</i>. 2000.',
    'core', 'acquired', '1', '69-year-old with left medial frontal lesion compulsively read irrelevant environmental words during conversation (acquired hyperlexia with echolalia).')
ref('yamadori2000', 2000, 'Yamadori A. A dynamic neuropsychological approach [in Japanese]. <i>Rinsho Shinkeigaku</i>. 2000.',
    'core', 'acquired', 'theory', 'Acquired hyperlexia explained as bottom-up stimulus processing overpowering top-down inhibition.')
ref('delong2002', 2002, 'DeLong GR, Ritch CR, Burch S. Fluoxetine response in children with autistic spectrum disorders: correlation with familial major affective disorder and intellectual achievement. <i>Dev Med Child Neurol</i>. 2002. doi:10.1017/s0012162201002717',
    'core', 'group', '129', 'In 129 autistic children, hyperlexia clustered with familial affective disorder, unusual family intellectual achievement and medication response, suggesting a genetically distinct subgroup.')
ref('grigorenko2002', 2002, 'Grigorenko EL, Klin A, Pauls DL, Senft R, Hooper C, Volkmar F. A descriptive study of hyperlexia in a clinically referred sample of children with developmental delays. <i>J Autism Dev Disord</i>. 2002. doi:10.1023/a:1017995805511',
    'core', 'group', '80', 'No sex difference in frequency; hyperlexia significantly more frequent in PDD than non-PDD diagnoses; IQ range and outcomes comparable to non-hyperlexic peers.')
ref('nation2002', 2002, 'Nation K, Clarke P, Snowling MJ. General cognitive ability in children with reading comprehension difficulties. <i>Br J Educ Psychol</i>. 2002. doi:10.1348/00070990260377604',
    'core', 'group', '25 + 24', 'Most poor comprehenders had verbal-domain weaknesses; a subset with below-average general ability showed a hyperlexic profile where accuracy was surprisingly good.')
ref('richman2002', 2002, 'Richman LC, Wood KM. Learning disability subtypes: classification of high functioning hyperlexia. <i>Brain Lang</i>. 2002. doi:10.1016/s0093-934x(02)00007-x',
    'core', 'group', '30', 'Two subtypes of high-functioning hyperlexia: (1) language-learning disorder with good visual memory and phonetic errors; (2) nonverbal-learning-disorder pattern with visuospatial deficits and sight-word errors.')
ref('grigorenko2003', 2003, 'Grigorenko EL, Klin A, Volkmar F. Annotation: Hyperlexia: disability or superability? <i>J Child Psychol Psychiatry</i>. 2003;44:1079–1091. doi:10.1111/1469-7610.00193',
    'core', 'review', '—', 'Review of six controversies; concluded hyperlexia is a superability of a specific group with developmental disorders rather than a disability in the general population.')
ref('kennedy2003', 2003, 'Kennedy B. Hyperlexia profiles. <i>Brain Lang</i>. 2003. doi:10.1016/s0093-934x(02)00512-6',
    'core', 'case', '2', 'Two distinct pathways to superior word recognition, both with specialised orthographic processing; supports an asset rather than deficit analysis.')
ref('martos2003', 2003, 'Martos-Pérez J, Ayuda-Pascual R. Autism and hyperlexia [in Spanish]. <i>Rev Neurol</i>. 2003.',
    'core', 'review', '—', 'Links hyperlexia to autistic strengths in visual memory, visual discrimination and motivation toward visual material; "an island of ability".')
ref('turkeltaub2004', 2004, 'Turkeltaub PE, Flowers DL, Verbalis A, Miranda M, Gareau L, Eden GF. The neural basis of hyperlexic reading: an fMRI case study. <i>Neuron</i>. 2004. doi:10.1016/s0896-6273(03)00803-1',
    'core', 'case', '1 + controls', '9-year-old reading 6 years ahead: hyperactivation of left inferior frontal and superior temporal cortex and right inferior temporal sulcus; mirror image of dyslexic hypoactivation.')
ref('talero2006', 2006, 'Talero-Gutierrez C. Hyperlexia in Spanish-speaking children: report of 2 cases from Colombia, South America. <i>J Neurol Sci</i>. 2006. doi:10.1016/j.jns.2006.05.058',
    'core', 'case', '2', 'Two autistic Spanish-speaking children followed 8 years: self-taught reading before 5, minimal comprehension, obsessional reading; orthographic route proposed.')
ref('diaz2006', 2006, 'Díaz-Sepúlveda M, Sinning M, Gaete-Camus G. Hyperlexia and pseudotetanus in Hashimoto\'s encephalopathy [in Spanish]. <i>Rev Neurol</i>. 2006. doi:10.33588/rn.4304.2005453',
    'core', 'acquired', '1', 'Acquired hyperlexia as a sign of Hashimoto\'s encephalopathy (bibliographic record only).', abs=False)
ref('nation2006', 2006, 'Nation K, Clarke P, Wright B, Williams C. Patterns of reading ability in children with autism spectrum disorder. <i>J Autism Dev Disord</i>. 2006. doi:10.1007/s10803-006-0130-1',
    'core', 'group', '41', 'In 41 autistic children, word/nonword reading were average but comprehension impaired, with floor-to-ceiling variability; some showed a hyperlexic profile.')
ref('temple2006', 2006, 'Temple CM. Developmental and acquired dyslexias. <i>Cortex</i>. 2006. doi:10.1016/s0010-9452(08)70434-9',
    'core', 'review', '—', 'Hyperlexia takes several forms, including broad hyperdevelopment (Turner); reading of number words and Arabic numerals can dissociate from other words.')
ref('etchepareborda2007', 2007, 'Etchepareborda MC, Díaz-Lucero A, Pascuale MJ, Abad-Mas L, Ruiz-Andrés R. Asperger\'s syndrome, little teachers: special skills [in Spanish]. <i>Rev Neurol</i>. 2007.',
    'core', 'review', '—', 'Special skills (hypermnesia, hyperlexia, hypercalculia, calendar calculation, music, art) in Asperger syndrome as levers for employment.')
ref('newman2007', 2007, 'Newman TM, Macomber D, Naples AJ, Babitz T, Volkmar F, Grigorenko EL. Hyperlexia in children with autism spectrum disorders. <i>J Autism Dev Disord</i>. 2007;37:760–774. doi:10.1007/s10803-006-0206-y',
    'core', 'group', '3 groups', 'ASD+HPL beat ASD−HPL on word and pseudoword decoding and matched reading-age-matched typical readers on everything except comprehension; same basic model of word reading.')
ref('cardoso2008', 2008, 'Cardoso-Martins C, Silva JR. How do hyperlexic children learn to read? A study of an autistic child [in Portuguese]. <i>Rev Bras Psiquiatr</i>. 2008. doi:10.1590/s1516-44462008000300024',
    'core', 'case', '1', 'Brazilian case study of how an autistic hyperlexic child learned to read (bibliographic record only).', abs=False)
ref('saldana2009', 2009, 'Saldaña D, Carreiras M, Frith U. Orthographic and phonological pathways in hyperlexic readers with autism spectrum disorders. <i>Dev Neuropsychol</i>. 2009. doi:10.1080/87565640902805701',
    'core', 'group', '14 + 12', 'Adolescents with ASD and a reading–comprehension gap: outstanding readers (vs verbal IQ) had stronger lexical orthographic and phonological representations but no sublexical, rapid-naming or memory advantage.')
ref('suzuki2009', 2009, 'Suzuki T, Itoh S, Hayashi M, Kouno M, Takeda K. Hyperlexia and ambient echolalia in a case of cerebral infarction of the left anterior cingulate cortex and corpus callosum. <i>Neurocase</i>. 2009. doi:10.1080/13554790902842037',
    'core', 'acquired', '1', 'Acquired hyperlexia with ambient echolalia after left anterior cingulate infarct; faulty inhibition of intact subroutines.')
ref('castles2010', 2010, 'Castles A, Crichton A, Prior M. Developmental dissociations between lexical reading and comprehension: evidence from two cases of hyperlexia. <i>Cortex</i>. 2010. doi:10.1016/j.cortex.2010.06.016',
    'core', 'case', '2', 'Two cases read irregular words normally even when they could not define them: evidence for a direct lexical route from print to sound not mediated by meaning.')
ref('joshi2010', 2010, 'Joshi RM, Padakannaya P, Nishanimath S. Dyslexia and hyperlexia in bilinguals. <i>Dyslexia</i>. 2010. doi:10.1002/dys.402',
    'core', 'case', '2', 'Kannada–English bilinguals: the hyperlexic case decoded well but comprehended poorly in <b>both</b> languages; profiles cut across language boundaries.')
ref('treffert2011', 2011, 'Treffert DA. Hyperlexia III: separating "autistic-like" behaviors from autistic disorder; assessing children who read early or speak late. <i>WMJ</i>. 2011.',
    'core', 'theory', '—', 'Hyperlexia, "Einstein syndrome" (late talkers) and "blindisms" can mimic autism; careful differentiation matters for treatment and prognosis.')
ref('samson2012', 2012, 'Samson F, Mottron L, Soulières I, Zeffiro TA. Enhanced visual functioning in autism: an ALE meta-analysis. <i>Hum Brain Mapp</i>. 2012. doi:10.1002/hbm.21307',
    'core', 'meta', 'fMRI studies', 'Autistic participants showed more temporal, occipital and parietal activity and less frontal activity across faces, objects and words: enhanced perceptual resource allocation that may underlie hyperlexia.')
ref('cardoso2013', 2013, 'Cardoso-Martins C, Gonçalves DT, de Magalhães CG. What are the mechanisms behind exceptional word reading ability in hyperlexia? Evidence from a 4-year-old hyperlexic boy\'s invented spellings. <i>J Autism Dev Disord</i>. 2013. doi:10.1007/s10803-013-1857-0',
    'core', 'case', '1', 'Used a 4-year-old\'s invented spellings to probe the mechanisms of hyperlexic word reading (bibliographic record only).', abs=False)
ref('lamonica2013', 2013, 'Lamônica DA, Gejão MG, Prado LM, Ferreira AT. Reading skills in children diagnosed with hyperlexia: case reports. <i>CoDAS</i>. 2013. doi:10.1590/s2317-17822013000400016',
    'core', 'case', '6', 'Six Brazilian boys (4;4–5;2), hyperlexia noticed before 36 months: all recognised letters and numbers; most did not understand texts they read.')
ref('lin2013', 2013, 'Lin CS, Chang SH, Liou WY, Tsai YS. The development of a multimedia online language assessment tool for young children with autism. <i>Res Dev Disabil</i>. 2013. doi:10.1016/j.ridd.2013.06.042',
    'core', 'group', '300 + 35', 'Six-subtest online assessment (decoding, homographs, auditory/visual vocabulary and sentence comprehension) to identify hyperlexic learning profiles; differentiated autistic children with up to 92% accuracy.')
ref('mottron2013', 2013, 'Mottron L, Bouvet L, Bonnel A, Samson F, Burack JA, Dawson M, Heaton P. Veridical mapping in the development of exceptional autistic abilities. <i>Neurosci Biobehav Rev</i>. 2013. doi:10.1016/j.neubiorev.2012.11.016',
    'core', 'theory', '—', 'Veridical mapping: perception couples with isomorphic structures (letters↔sounds, pitch↔note names), explaining the shared structure of hyperlexia, absolute pitch and synaesthesia.')
ref('treffert2014', 2014, 'Treffert DA. Savant syndrome: realities, myths and misconceptions. <i>J Autism Dev Disord</i>. 2014. doi:10.1007/s10803-013-1906-8',
    'core', 'review', '—', 'Up to 1 in 10 autistic people have savant abilities; ~50% of savant cases involve autism; IQ can be superior; skills grow from duplication to improvisation to creation.')
ref('pacheva2014', 2014, 'Pacheva I, Panov G, Gillberg C, Neville B. A girl with tuberous sclerosis complex presenting with severe epilepsy and electrical status epilepticus during sleep, and with high-functioning autism and mutism. <i>Cogn Behav Neurol</i>. 2014. doi:10.1097/wnn.0000000000000026',
    'core', 'case', '1', '13-year-old with TSC who did not speak yet read, wrote and comprehended well, with hyperlexia, hypermnesia and hypercalculia.')
ref('wei2015', 2015, 'Wei X, Christiano ER, Yu JW, Wagner M, Spiker D. Reading and math achievement profiles and longitudinal growth trajectories of children with an autism spectrum disorder. <i>Autism</i>. 2015. doi:10.1177/1362361313516549',
    'core', 'group', 'national', 'Nationally representative US sample (6–9 y): profiles higher-achieving 39%, hyperlexia 9%, hypercalculia 20%, lower-achieving 32%; all lost ground in passage comprehension over time.')
ref('stein2015', 2015, 'Stein DS, Welchons LW, Corley KB, et al. Autism associated with early institutionalization, high intelligence, and naturalistic behavior therapy in a 7-year-old boy. <i>J Dev Behav Pediatr</i>. 2015. doi:10.1097/dbp.0000000000000120',
    'core', 'case', '1', 'Gifted (verbal IQ 143), hyperlexic boy improved markedly with Floortime and social/pragmatic group speech therapy; raises the "too bright for peers" question.')
ref('sparks2018', 2018, 'Sparks RL, Luebbers J. How many U.S. high school students have a foreign language reading "disability"? Reading without meaning and the simple view. <i>J Learn Disabil</i>. 2018. doi:10.1177/0022219417704168',
    'core', 'group', 'random sample', 'Most US high-school Spanish learners fit the hyperlexic profile (decoding > comprehension) in their second language: "reading without meaning" is normal in early L2 learning.')
ref('tobia2018', 2018, 'Tobia V, Brigstocke S, Hulme C, Snowling MJ. Developmental changes in the cognitive and educational profiles of children and adolescents with 22q11.2 deletion syndrome. <i>J Appl Res Intellect Disabil</i>. 2018. doi:10.1111/jar.12344',
    'core', 'group', '18', 'In 22q11.2 deletion syndrome, more than two-thirds showed reading above IQ expectations ("hyperlexia"); literacy kept pace with development.')
ref('asberg2019a', 2019, 'Åsberg Johnels J, Gillberg C, Kopp S. A hyperlexic-like reading style is associated with increased autistic features in girls with ADHD. <i>J Atten Disord</i>. 2019. doi:10.1177/1087054716685838',
    'core', 'group', '10 + 26', 'Among 36 girls with ADHD, 10 had a hyperlexic-like style; these girls had more social-communication difficulties (ADOS-G, ADI-R) but similar IQ and vocabulary.')
ref('asberg2019b', 2019, 'Åsberg Johnels J, Carlsson E, Norbury C, Gillberg C, Miniscalco C. Current profiles and early predictors of reading skills in school-age children with autism spectrum disorders. <i>Autism</i>. 2019. doi:10.1177/1362361318811153',
    'core', 'group', '53', 'Population cohort at age 8: 25 poor readers, 18 skilled readers, 10 "hyperlexic/poor comprehenders". Oral-language weaknesses at age 3 predicted the hyperlexic profile five years later.')
ref('rendall2019', 2019, 'Rendall AR, Perrino PA, Buscarello AN, Fitch RH. Shank3B mutant mice display pitch discrimination enhancements and learning deficits. <i>Int J Dev Neurosci</i>. 2019. doi:10.1016/j.ijdevneu.2018.10.003',
    'core', 'animal', 'mice', 'Autism-risk gene model (SHANK3) shows enhanced low-level pitch discrimination; frames language profiles "from nonverbal to hyperlexic".')
ref('solazzo2021', 2021, 'Solazzo S, Kojovic N, Robain F, Schaer M. Measuring the emergence of specific abilities in young children with autism spectrum disorders: the example of early hyperlexic traits. <i>Brain Sci</i>. 2021. doi:10.3390/brainsci11060692',
    'core', 'group', '155', '9% of preschoolers with ASD showed early hyperlexic traits; associated with more repetitive behaviours but also more social-oriented behaviour and better expressive and written communication one year later.')
ref('macdonald2021', 2021, 'Macdonald D, Luk G, Quintin EM. Early word reading of preschoolers with ASD, both with and without hyperlexia, compared to typically developing preschoolers. <i>J Autism Dev Disord</i>. 2021. doi:10.1007/s10803-020-04628-8',
    'core', 'group', '3 groups', 'ASD+HPL had advanced word reading and letter naming without matching phonological awareness, letter–sound knowledge or language: a non-phonological route to early reading.')
ref('macdonald2022', 2022, 'Macdonald D, Luk G, Quintin EM. Early reading comprehension intervention for preschoolers with autism spectrum disorder and hyperlexia. <i>J Autism Dev Disord</i>. 2022. doi:10.1007/s10803-021-05057-x',
    'core', 'group', '30', 'Parent-supported tablet program (word-, phrase-, sentence-level comprehension; word–picture matching): significant reading comprehension gains for ASD+HPL vs TD (p = .023); receptive language gains in all groups.')
ref('mammarella2022', 2022, 'Mammarella V, Arigliani E, Giovannone F, Cavalli G, Tofani M, Sogos C. Is it hyperlexia? Toward a deeper understanding of precocious reading skills in two cases of children with autism spectrum disorder. <i>Clin Ter</i>. 2022. doi:10.7417/ct.2022.2385',
    'core', 'case', '2', 'Two autistic early readers with above-average IQ and text comprehension (one weak only in oral text) challenge the comprehension-deficit definition.')
ref('ostrolenk2017', 2017, 'Ostrolenk A, Forgeot d\'Arc B, Jelenic P, Samson F, Mottron L. Hyperlexia: systematic review, neurocognitive modelling, and outcome. <i>Neurosci Biobehav Rev</i>. 2017. doi:10.1016/j.neubiorev.2017.04.029',
    'core', 'review', '82 cases; 912', 'Systematic review of 82 cases and group studies (912 participants, 315 hyperlexic): 6–21% of autistic children; 84% of cases autistic; chronologically inverted path to reading using the visual word-form system.')
ref('ostrolenk2023', 2023, 'Ostrolenk A, Courchesne V, Mottron L. A longitudinal study on language acquisition in monozygotic twins concordant for autism and hyperlexia. <i>Brain Cogn</i>. 2023. doi:10.1016/j.bandc.2023.106099',
    'core', 'case', '2', 'Montréal twins (4–8 y) whose language was only letters and numbers until age 4 then broadened to full sentences: hyperlexic skills can be harnessed toward oral language.')
ref('luo2023', 2023, 'Luo L, Su IF. Meta-linguistic awareness skills in Chinese-speaking children with hyperlexia: a single-case study. <i>Front Psychol</i>. 2023. doi:10.3389/fpsyg.2023.1049775',
    'core', 'case', '1 + controls', 'Chinese hyperlexic reading without advanced metalinguistic skills (weak morphology): likely direct whole-character-to-sound mapping.')
ref('ostrolenk2024', 2024, 'Ostrolenk A, Gagnon D, Boisvert M, Lemire O, Dick SC, Côté MP, Mottron L. Enhanced interest in letters and numbers in autistic children. <i>Mol Autism</i>. 2024. doi:10.1186/s13229-024-00606-4',
    'core', 'group', '701; 313', 'Montréal clinic cohort: 22–37% of autistic children had intense/exclusive interest in letters (OR 2.78) and numbers (OR 3.49) despite 76% being minimally verbal; interest emerged ~30 months, independent of oral language.')
ref('rossello2025', 2025, 'Rosselló J, Celma-Miralles A, Martins MD. Visual recursion without recursive language? A case study of a minimally verbal autistic child. <i>Front Psychiatry</i>. 2025. doi:10.3389/fpsyt.2025.1540985',
    'core', 'case', '1', 'Minimally verbal 11-year-old with trilingual hyperlexia (Spanish, Catalan, English) and a print-acquired lexicon processed visual recursion like typical peers.')

# ---------------------------------------------------------------- targeted literature
ref('gough1986', 1986, 'Gough PB, Tunmer WE. Decoding, reading, and reading disability. <i>Remedial Spec Educ</i>. 1986;7(1):6–10. doi:10.1177/074193258600700104',
    'background', 'theory', '—', 'The Simple View of Reading: reading comprehension = decoding × language comprehension.')
ref('mottron2006', 2006, 'Mottron L, Dawson M, Soulières I, Hubert B, Burack J. Enhanced perceptual functioning in autism: an update, and eight principles of autistic perception. <i>J Autism Dev Disord</i>. 2006;36:27–43. doi:10.1007/s10803-005-0040-7',
    'background', 'theory', '—', 'Enhanced Perceptual Functioning model: perception plays a larger, more autonomous role in autistic cognition.')
ref('brown2013', 2013, 'Brown HM, Oram-Cardy J, Johnson A. A meta-analysis of the reading comprehension skills of individuals on the autism spectrum. <i>J Autism Dev Disord</i>. 2013. doi:10.1007/s10803-012-1638-1',
    'targeted', 'meta', '36 studies', 'Comprehension gap g = −0.7 SD; semantic knowledge explained 57% and decoding 55% of variance; highly social texts were harder; autism alone does not predict comprehension difficulty.')
ref('elzein2014', 2014, 'El Zein F, Solis M, Vaughn S, McCulley L. Reading comprehension interventions for students with autism spectrum disorders: a synthesis of research. <i>J Autism Dev Disord</i>. 2014. doi:10.1007/s10803-013-1989-2',
    'targeted', 'review', '12 studies', 'Effective components: question generation, graphic organisers, predictions, anaphoric cueing, explicit instruction and grouping.')
ref('ng2014', 2014, 'Ng PMH, Chia NKH. Reading comprehension for children with hyperlexia: a scaffolding method. <i>Int J Case Stud</i>. 2014;3(10):71–77.',
    'targeted', 'case', 'small n', 'Scaffolding Interrogative Method (SIM): comprehension improved in every intervention phase; comprehension age rose without reading-age change, closing the hyperlexic gap (secondary sources report +19.4% to +36.3% in 3 months).')
ref('bouvet2014', 2014, 'Bouvet L, Donnadieu S, Valdois S, Caron C, Dawson M, Mottron L. Veridical mapping in savant abilities, absolute pitch, and synesthesia: an autism case study. <i>Front Psychol</i>. 2014. doi:10.3389/fpsyg.2014.00106',
    'targeted', 'case', '1', 'Case "FC" combines savant skills, absolute pitch and synaesthesia-like associations, supporting a common veridical-mapping mechanism.')
ref('stephenson2016', 2016, 'Stephenson KG, Quintin EM, South M. Age-related differences in response to music-evoked emotion among children and adolescents with autism spectrum disorders. <i>J Autism Dev Disord</i>. 2016. doi:10.1007/s10803-015-2624-1',
    'targeted', 'group', '8–11 & 16–18 y', 'Reduced skin-conductance response to music-evoked emotion in ASD; age × diagnosis interaction for identifying scary music.')
ref('gonzalez2018', 2018, 'Gonzalez-Barrero AM, Nadig A. Bilingual children with autism spectrum disorders: the impact of amount of language exposure on vocabulary and morphological skills at school age. <i>Autism Res</i>. 2018;11:1667–1678. doi:10.1002/aur.2023',
    'targeted', 'group', '30 + 47', 'Montréal study: current language exposure explained 62% of vocabulary and 49% of morphology variance in both autistic and typical children; many autistic children acquire two languages.')
ref('loukusa2018', 2018, 'Loukusa S, Mäkinen L, Kuusikko-Gauffin S, Ebeling H, Leinonen E. Assessing social-pragmatic inferencing skills in children with autism spectrum disorder. <i>J Commun Disord</i>. 2018. doi:10.1016/j.jcomdis.2018.01.006',
    'targeted', 'group', '16 + 16', 'Autistic children struggled most with context-dependent inferences, more so when mind-reading was needed, and with explaining how they used context.')
ref('gonzalez2019', 2019, 'Gonzalez-Barrero AM, Nadig A. Brief report: vocabulary and grammatical skills of bilingual children with autism spectrum disorders at school age. <i>J Autism Dev Disord</i>. 2019. doi:10.1007/s10803-019-04073-2',
    'targeted', 'group', '13 + 13', 'Bilingual autistic children scored in the average monolingual range for receptive vocabulary; bilingual exposure is not detrimental.')
ref('quintin2019', 2019, 'Quintin EM. Music-evoked reward and emotion: relative strengths and response to intervention of people with ASD. <i>Front Neural Circuits</i>. 2019. doi:10.3389/fncir.2019.00049',
    'targeted', 'review', '—', 'Music (pitch perception, musical memory, emotion identification) is a relative strength in ASD and a strength-based route to social and communication goals.')
ref('zhang2019', 2019, 'Zhang S, Joshi RM. Profile of hyperlexia: reconciling conflicts through a systematic review and meta-analysis. <i>J Neurolinguistics</i>. 2019;49:1–28. doi:10.1016/j.jneuroling.2018.08.001',
    'targeted', 'meta', 'meta-analysis', 'Supports the profile of good decoding with poor listening and reading comprehension; 66.22% of identified hyperlexics showed precocious decoding; ~96% of studies drew on atypical populations; decoding definitions drive heterogeneity.')
ref('mcintyre2020', 2020, 'McIntyre NS, Grimm RP, Solari EJ, Zajic MC, Mundy PC. Growth in narrative retelling and inference abilities and relations with reading comprehension in children and adolescents with autism spectrum disorder. <i>Autism Dev Lang Impair</i>. 2020. doi:10.1177/2396941520968028',
    'targeted', 'group', '81', '81 autistic youth aged 8–16, three waves 15 months apart: narrative and inference growth relate to reading comprehension outcomes.')
ref('sorenson2021', 2021, 'Sorenson Duncan T, Karkada M, Deacon SH, Smith IM. Building meaning: meta-analysis of component skills supporting reading comprehension in children with autism spectrum disorder. <i>Autism Res</i>. 2021. doi:10.1002/aur.2483',
    'targeted', 'meta', '26 studies', 'In autistic 6–18-year-olds both word reading (mean r = .65) and oral language (r = .61) correlate similarly with comprehension.')
ref('ober2021', 2021, 'Ober T, Homer BD, Plass JL. Indirect effects of task-switching on reading comprehension via decoding skills among adolescents with autism. <i>PsyArXiv preprint</i>. 2021. doi:10.31234/osf.io/fskg4',
    'targeted', 'group', '45 + 43', 'In autistic adolescents (mean 14.9 y) task-switching predicted comprehension indirectly through decoding.')
ref('solis2021', 2021, 'Solis M, Reutebuch CK, Falcomata T, Steinle PK, Miller VL, Vaughn S. Vocabulary and main idea reading intervention using text choice to improve content knowledge and reading comprehension of adolescents with autism spectrum disorder. <i>Behav Modif</i>. 2021. doi:10.1177/0145445519853781',
    'targeted', 'case', '5', 'Middle-school vocabulary and main-idea intervention with text choice; upward stable trends; students valued choosing their texts.')
ref('romani2021', 2021, 'Romani M, Martucci M, Castellano Visaggi M, et al. Absolute pitch, pitch discrimination and autism spectrum disorder. <i>Clin Ter</i>. 2021. doi:10.7417/ct.2021.2381',
    'targeted', 'review', '17 articles', 'Systematic review: absolute pitch prevalence in autism 5–11% with enhanced pitch discrimination; suggests using it for joint attention and communication.')
ref('heaton2008', 2008, 'Heaton P, Davis RE, Happé FG. Exceptional absolute pitch perception for spoken words in an able adult with autism. <i>Neuropsychologia</i>. 2008. doi:10.1016/j.neuropsychologia.2008.02.006',
    'targeted', 'case', '1 + controls', 'Autistic adult with absolute pitch named the pitch of speech far better than controls with AP.')
ref('brenton2008', 2008, 'Brenton JN, Devries SP, Barton C, Minnich H, Sokol DK. Absolute pitch in a four-year-old boy with autism. <i>Pediatr Neurol</i>. 2008. doi:10.1016/j.pediatrneurol.2008.05.004',
    'targeted', 'case', '1', 'One of the youngest reported cases of absolute pitch in autism; may become a lifelong skill.')
ref('geretsegger2022', 2022, 'Geretsegger M, Fusar-Poli L, Elefant C, Mössler KA, Vitale G, Gold C. Music therapy for autistic people. <i>Cochrane Database Syst Rev</i>. 2022. doi:10.1002/14651858.cd004381.pub4',
    'targeted', 'meta', '26 RCTs; 1165', 'Moderate-certainty benefits for global improvement (RR 1.22), quality of life (SMD 0.28) and symptom severity (SMD −0.83); unclear effects on social interaction and communication.')
ref('martelle2022', 2022, 'Martelle SN, Namazi M. Feeling thrown for a loop? The effects of inferencing on spoken language idiom comprehension in autism. <i>Lang Speech Hear Serv Sch</i>. 2022. doi:10.1044/2021_lshss-21-00100',
    'targeted', 'review', '—', 'Idiom comprehension depends on inferencing; transparency, familiarity and context help; explicit teaching recommended.')
ref('madaus2022', 2022, 'Madaus J, Tarconish E, Langdon SW, Gelbar N. High school and transition experiences of twice exceptional students with autism spectrum disorder: parents\' perceptions. <i>Front Psychol</i>. 2022. doi:10.3389/fpsyg.2022.995356',
    'targeted', 'group', '10', 'Parents of 10 twice-exceptional autistic college students described best and hardest aspects of high school and transition supports.')
ref('sivathasan2023', 2023, 'Sivathasan S, Dahary H, Burack JA, Quintin EM. Basic emotion recognition of children on the autism spectrum is enhanced in music and typical for faces and voices. <i>PLoS One</i>. 2023. doi:10.1371/journal.pone.0279002',
    'targeted', 'group', '25 + 23', 'Autistic children (6–13 y) showed a relative strength recognising emotion in music, with typical accuracy for faces and voices.')
ref('lee2025', 2025, 'Lee S, Quinn S, Jiang Y. The use of pictorial or graphic representation in reading comprehension interventions for students with autism spectrum disorders: a meta-analysis. <i>J Autism Dev Disord</i>. 2025. doi:10.1007/s10803-025-07014-4',
    'targeted', 'meta', '5 SCED', 'Pictorial/graphic representations produced moderate-to-strong comprehension gains (Tau-U = 0.85); paper-based more consistent, technology-based strong but variable.')
ref('reis2025', 2025, 'Reis SM, Renzulli SJ. Research-based strength-based teaching and support strategies for twice-exceptional high school students with autism spectrum disorder. <i>Behav Sci</i>. 2025. doi:10.3390/bs15060834',
    'targeted', 'review', '—', 'Synthesis of a Javits-funded programme: strength- and interest-based teaching supports social-emotional health and achievement of 2e autistic students.')
ref('cheng2026', 2026, 'Cheng L, Zhang J, Mao H, Jia X, Zhan L, Liu C. Brain activation patterns of figurative language comprehension in individuals with autism spectrum disorder: an ALE meta-analysis. <i>Front Neurosci</i>. 2026. doi:10.3389/fnins.2026.1717020',
    'targeted', 'meta', '6 fMRI; 95 + 98', 'Shared figurative-language network (bilateral STG, right insula) but consistent hypoactivation of left STG/MTG in autism.')

# ---------------------------------------------------------------- web / grey literature
ref('cleveland', None, 'Cleveland Clinic. Hyperlexia: signs, diagnosis & treatment. my.clevelandclinic.org/health/diseases/hyperlexia (accessed 27 Sep 2026).',
    'web', 'web', '—', 'Clinical overview: signs (books over toys, spelling aloud or in the air), no single test, multidisciplinary evaluation, speech/occupational/psychological therapy.')
ref('treffertcenter', None, 'SSM Health Treffert Center. Hyperlexia. ssmhealth.com/treffert-center (accessed 27 Sep 2026).',
    'web', 'web', '—', 'Three types; early readers who speak late are often misdiagnosed; speech, occupational and play-based therapy; use written language to teach.')
ref('whiteside2023', 2023, 'Whiteside M. Hyperlexia: precocious reading or reading disorder? <i>Psychology Today</i>, Read Like a Psychologist. August 2023.',
    'web', 'web', '—', 'Argues hyperlexia is a genuine reading disorder under the Simple View; recommends IQ, language, comprehension and autism evaluation.')
ref('transmitter', None, 'The Transmitter (formerly Spectrum). When a flair for reading is mistaken for autism. thetransmitter.org (accessed 27 Sep 2026).',
    'web', 'web', '—', 'Hyperlexia III case ("Garret") who later made his college Dean\'s list; Treffert collected 200+ parent reports.')
ref('nextcomesl', 2025, 'And Next Comes L. Examples of visual supports for hyperlexic learners. andnextcomesl.com (Jan 2025).',
    'web', 'web', '—', 'Seven families of visual supports (school, comprehension, communication, regulation, executive function, social, self-advocacy): "include the written word as much as possible".')
ref('meaningfulspeech', None, 'Meaningful Speech. Hyperlexia and gestalt language processing. meaningfulspeech.com (accessed 27 Sep 2026).',
    'web', 'web', '—', 'Many hyperlexic children are gestalt language processors; model language in writing, keep letters available, keyboard AAC, turn on subtitles.')
ref('mcgillnews', None, 'McGill University Newsroom. Helping children with autism and hyperlexia learn to understand what they read. mcgill.ca/newsroom (2021).',
    'web', 'web', '—', 'Lay summary of the McGill tablet intervention; comprehension work can start as early as age 3; app planned as open source.')
ref('twinkl', None, 'Twinkl. Hyperlexia: what is it, and how can I support a hyperlexic learner? twinkl.com/blog (accessed 27 Sep 2026).',
    'web', 'web', '—', 'Interest in systems (periodic table, dates, flags, languages); leverage rote learning, special interests, written language ("when in doubt, write it out"), and task breakdown.')
