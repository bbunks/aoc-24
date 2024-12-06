import { Relation } from "./Relation";

export class RelationMap<T> {
  private _relations: Relation<T, T>[];
  private _transitiveClosure: RelationMap<T> | null;

  constructor(relations?: Relation<T, T>[]) {
    this._relations = relations ?? [];
    this.addRelation = this.addRelation.bind(this);
    this.getRelationsForTerm = this.getRelationsForTerm.bind(this);
    this.findPartitions = this.findPartitions.bind(this);
  }

  addRelation(input: T, out: T) {
    // Skip duplicates
    if (this.isRelated(input, out)) return;

    this._relations.push(new Relation(input, out));
    this._transitiveClosure = null;
  }

  format() {
    let out = "{";
    out += this._relations.map((relation) => relation.format()).join(", ");
    out += "}";

    return out;
  }

  private getRelationsForTerm(term: T) {
    return this._relations.filter((relation) => relation.input === term);
  }

  // Only works when the in and out of a relation are the same type

  union(relationMap: RelationMap<T>) {
    return new RelationMap(
      [...relationMap.getRelations(), ...this._relations].filter(
        (r1, index, relations) => {
          return (
            relations.findIndex((r2) => r1.format() === r2.format()) === index
          );
        }
      )
    );
  }

  getRelations() {
    return this._relations;
  }

  getInDegOfTerm(term: T) {
    return this.getRelations().filter((relation) => relation.out === term)
      .length;
  }

  getOutDegOfTerm(term: T) {
    return this.getRelations().filter((relation) => relation.input === term)
      .length;
  }

  translateArr(arr: T[]): T[] {
    return arr.flatMap((term) =>
      this.getRelationsForTerm(term).map((relation) => relation.out)
    );
  }

  walk(relationMap?: RelationMap<T>): RelationMap<T> {
    if (this.getRelations().length === 0) return new RelationMap();
    const map = relationMap ?? this;
    const relations = map
      .getRelations()
      .flatMap((r1) => {
        const relations = this.getRelationsForTerm(r1.out).map(
          (r2) => new Relation(r1.input, r2.out)
        );

        return relations;
      })
      .filter((r1, index, relations) => {
        return (
          relations.findIndex((r2) => r1.format() === r2.format()) === index
        );
      });

    return new RelationMap(relations);
  }

  walkTo(power: number) {
    const maps: RelationMap<T>[] = [this];

    for (let i = 1; i < power; i++) {
      maps.push(this.walk(maps[i - 1]));
    }

    maps[power - 1];

    return maps[power - 1];
  }

  getTransitiveClosure(): RelationMap<T> {
    if (this._transitiveClosure) return this._transitiveClosure;
    if (this.getRelations().length === 0) return new RelationMap();
    if (
      typeof this.getRelations()[0].input !== typeof this.getRelations()[0].out
    )
      throw "In order to walk, you must have the same type for your input and output";

    const uniqueInputs = this._relations.filter((r1, index, relations) => {
      return relations.findIndex((r2) => r1.input === r2.input) === index;
    }).length;

    const maps: RelationMap<T>[] = [this];

    for (let i = 1; i < uniqueInputs; i++) {
      maps.push(this.walk(maps[i - 1]));
    }

    this._transitiveClosure = maps.reduce(
      (prev, curr) => prev.union(curr),
      new RelationMap()
    );

    return this._transitiveClosure;
  }

  createAdjacencyMatrix() {
    const uniqueInputs = this._relations
      .filter((r1, index, relations) => {
        return relations.findIndex((r2) => r1.input === r2.input) === index;
      })
      .map((r) => r.input);

    const uniqueOuts = this._relations
      .filter((r1, index, relations) => {
        return relations.findIndex((r2) => r1.input === r2.input) === index;
      })
      .map((r) => r.input);

    const lookupMap = new Map<T, Map<T, Boolean>>();

    return {
      inputs: uniqueInputs,
      outputs: uniqueOuts,
      matrix: uniqueInputs.map((input) => {
        lookupMap.set(input, new Map<T, Boolean>());
        return uniqueOuts.map((out) => {
          const isRelated = this.isRelated(input, out);
          lookupMap.get(input)?.set(input, isRelated);
          return isRelated ? "1" : "0";
        });
      }),
      // returns a 2 dimensional map that takes your input types and returns a bool
      lookupMap,
    };
  }

  isRelated(input: T, out: T) {
    return (
      this.getRelations().findIndex(
        (r) => r.input === input && r.out === out
      ) >= 0
    );
  }

  findPartitions() {
    const outMap = new Map<T, Set<T>>();
    const partitionKeyMap = new Map<T, T>();
    // this.getRelations().forEach((relation) => {
    //   let set = outMap.get(relation.input);

    //   if (!set) {
    //     set = new Set<T>();
    //     outMap.set(relation.input, set);
    //   }

    //   set.add(relation.out);
    // });

    const uniques = this.getUniqueValues();

    uniques.forEach((val1) => {
      const partitionKey = partitionKeyMap.get(val1) ?? val1;
      let partition = outMap.get(partitionKey) ?? new Set<T>();

      if (!outMap.get(partitionKey)) {
        outMap.set(partitionKey, partition);
      }

      uniques.map((val2) => {
        if (this.isRelated(val1, val2)) {
          partition.add(val2);
          if (!partitionKeyMap.get(val2))
            partitionKeyMap.set(val2, partitionKey);
        }
      });
    });

    const partitions: T[][] = [];

    outMap.forEach((p, k) => {
      partitions.push([k, ...p]);
    });

    return partitions; //=
  }

  getUniqueInputs() {
    return this._relations
      .filter((r1, index, relations) => {
        return relations.findIndex((r2) => r1.input === r2.input) === index;
      })
      .map((a) => a.input);
  }

  getUniqueOuts() {
    return this._relations
      .filter((r1, index, relations) => {
        return relations.findIndex((r2) => r1.out === r2.out) === index;
      })
      .map((a) => a.out);
  }

  getUniqueValues() {
    const valuesSet = new Set<T>();
    this._relations.forEach((r) => {
      valuesSet.add(r.input);
      valuesSet.add(r.out);
    });
    return [...valuesSet];
  }
}
